import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './schemas/place.schema';
import { GetPlacesDto } from './dto/get-places.dto';
import type { PaginatedResultDto } from '../common/interfaces/paginated-result.interface';
import { ReviewsService } from '../reviews/reviews.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PlacesRepository } from './places.repository';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepository: PlacesRepository,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placesRepository.create({ ...createPlaceDto })
  }

  async findAll(queryDto: GetPlacesDto): Promise<PaginatedResultDto<Place>> {
    const { category, page = 1, limit = 10 } = queryDto

    const filter: Record<string, string> = {}
    if (category) {
      filter.category = category
    }

    const skip = (page - 1) * limit

    const [paginatedResult, totalItems] = await Promise.all([
      this.placesRepository.findAll(filter, skip, limit),
      this.placesRepository.count(filter),
    ])
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: paginatedResult,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    }
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.placesRepository.findById(id)
    if(!place){
      throw new NotFoundException(`L'endroit avec l'id '${id}' n'existe pas.`)
    }
    return place
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const place = await this.placesRepository.updateById(id, { ...updatePlaceDto })
    if(!place){
      throw new NotFoundException(`L'endroit avec l'id '${id}' n'existe pas.`)
    }
    return place
  }

  async remove(id: string): Promise<void> {
    if(!(await this.placesRepository.exists(id))){
      throw new NotFoundException(`Le bâtiment avec l'ID "${id}" n'existe pas.`);
    }

    const reviews = await this.reviewsService.findByPlace(id)
    if (reviews.length > 0) {
      throw new ConflictException(`Le bâtiment avec l'ID "${id}" ne peut pas être supprimé car il a des avis associées.`);
    }

    await this.placesRepository.deleteById(id)
  }

  async calculateReviewCount(placeId: string): Promise<number> {
    const reviews = await this.reviewsService.findByPlace(placeId)
    return reviews.length
  }

  async calculateAverageRating(placeId: string): Promise<number | null> {
    const reviews = await this.reviewsService.findByPlace(placeId)

    if (reviews.length === 0) {
      return null
    }

    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
    return Number((sumRatings / reviews.length).toFixed(1))
  }

  @OnEvent('review.changed')
  async handleReviewChangedEvent(payload: { placeId: string }) {
    try{
      const reviewCount = await this.calculateReviewCount(payload.placeId)
      const averageRating = await this.calculateAverageRating(payload.placeId)

      await this.placesRepository.updateStats(payload.placeId, reviewCount, averageRating)
    } catch (error) {
      console.error('Error occurred while handling review changed event:', error);
    }
  }
}