import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import { PlaceStatus } from './enums/placeStatus.enum';
import { randomUUID } from 'crypto';
import { GetPlacesDto } from './dto/get-places.dto';
import type { PaginatedResultDto } from '../common/interfaces/paginated-result.interface';
import { ReviewsService } from '../reviews/reviews.service';
import { OnEvent } from '@nestjs/event-emitter';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class PlacesService implements OnModuleInit {
  private places: Place[] = []
  private readonly filePath: string
  private writeQueue: Promise<void> = Promise.resolve()

  constructor(private readonly reviewsService: ReviewsService) {
    const envPath = process.env.PLACES_FILE_PATH!

    this.filePath = path.resolve(process.cwd(), envPath)
  }

  async onModuleInit(){
    await this.loadFromFile()
  }

  private async loadFromFile(): Promise<void>{
    try{
      const content = await fs.readFile(this.filePath, "utf-8")
      this.places = content.trim()? JSON.parse(content) : []
    } catch(err : any){
      if(err.code === "ENOENT"){
        await fs.mkdir(path.dirname(this.filePath), {recursive : true})
        this.places = []
        await this.saveToFile()
      } else {
        throw err
      }
    }
  }

  private saveToFile(): Promise<void> {
    const snapshot = JSON.stringify(this.places, null, 2)

    this.writeQueue = this.writeQueue
    .catch(() => undefined)
    .then(async () => {
      const tmp = `${this.filePath}.tmp`
      await fs.writeFile(tmp, snapshot, "utf-8")
      await fs.rename(tmp, this.filePath)
    })

    return this.writeQueue
  }

  async create(createPlaceDto: CreatePlaceDto) {
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

    await this.saveToFile()
    return newPlace
  }

  findAll(queryDto: GetPlacesDto): PaginatedResultDto<Place> {
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

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const place: Place = this.findOne(id)
    Object.assign(place,updatePlaceDto)
    place.updatedAt = new Date().toISOString()
    await this.saveToFile()

    return place
  }

  async remove(id: string) {
    const index: number =  this.places.findIndex((place: Place) => place.id === id);
    if(index === -1){
      throw new NotFoundException(`Le bâtiment avec l'ID "${id}" n'existe pas.`);
    }

    if (this.reviewsService.findByPlace(id).length > 0) {
      throw new ConflictException(`Le bâtiment avec l'ID "${id}" ne peut pas être supprimé car il a des avis associées.`);
    }

    this.places.splice(index, 1);

    await this.saveToFile()
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
  async handleReviewChangedEvent(payload: { placeId: string }) {
    try{
      this.calculateReviewCount(payload.placeId);
      this.calculateAverageRating(payload.placeId);

      await this.saveToFile()
    } catch (error) {
      console.error('Error occurred while handling review changed event:', error);
    }
  }
}
