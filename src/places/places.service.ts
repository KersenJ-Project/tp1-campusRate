import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import { PlaceStatus } from './enums/placeStatus.enum';
import { randomUUID } from 'crypto';
import { GetPlacesDto } from './dto/get-places.dto';
import type { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { ReviewsService } from '../reviews/reviews.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PlacesService {

  private places: Place[] = []

  constructor(private readonly reviewsService: ReviewsService) {}

  create(createPlaceDto: CreatePlaceDto) {
    const now = new Date().toISOString()
    const newPlace: Place = {
      id: `plc_${randomUUID().substring(0, 8)}`,
      ...createPlaceDto,
      services: createPlaceDto.services ?? [],
      status: createPlaceDto.status ?? PlaceStatus.ACTIVE,
      averageRating: null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    }
    this.places.push(newPlace)
    return newPlace
  }

  findAll(queryDto: GetPlacesDto): PaginatedResult<Place> {
    const { category, page = 1, limit = 10 } = queryDto

    let filteredPlaces = this.places
    if (category) {
      filteredPlaces = filteredPlaces.filter((place) => place.category === category)
    }

    const totalItems = filteredPlaces.length
    const totalPages = Math.ceil(totalItems / limit)
    const skip = (page - 1) * limit
    const paginatedResult = filteredPlaces.slice(skip, skip + limit)

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

  findOne(id: string) {
    const place = this.places.find((p) => p.id === id)
    if(!place){
      throw new NotFoundException(`L'endroit avec l'id '${id}' n'existe pas.`)
    }
    return place
  }

  update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const place: Place = this.findOne(id)
    Object.assign(place,updatePlaceDto)
    place.updatedAt = new Date().toISOString()

    return place
  }

  remove(id: string) {
    const index: number =  this.places.findIndex((place: Place) => place.id === id);
    if(index === -1){
      throw new NotFoundException(`Le bâtiment avec l'ID "${id}" n'existe pas.`);
    }

    if (this.reviewsService.findByPlace(id).length > 0) {
      throw new ConflictException(`Le bâtiment avec l'ID "${id}" ne peut pas être supprimé car il a des critiques associées.`);
    }

    this.places.splice(index, 1);
  }

  calculateReviewCount(placeId: string): number {
    const place = this.findOne(placeId)
    const nbReviews = this.reviewsService.findByPlace(placeId).length

    place.reviewCount = nbReviews
    return nbReviews;
  }

  calculateAverageRating(placeId: string): number {
    const place = this.findOne(placeId)
    const reviews = this.reviewsService.findByPlace(placeId)

    if (reviews.length === 0) {
      place.averageRating = null
      return 0;
    }

    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = Number((sumRatings / reviews.length).toFixed(1))

    place.averageRating = averageRating
    return averageRating;
  }

  @OnEvent('review.changed')
  handleReviewChangedEvent(payload: { placeId: string }) {
    try{
      this.calculateReviewCount(payload.placeId);
      this.calculateAverageRating(payload.placeId);
    } catch (error) {
      console.error('Error occurred while handling review changed event:', error);
    }
  }
}
