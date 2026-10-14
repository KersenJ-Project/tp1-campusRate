import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly reviewsRepository: ReviewsRepository,
  ) {}

  async create(placeId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    if (!placeId) {
      throw new NotFoundException(`L'id de l'endroit est requis pour créer un avis.`)
    }

    if(!(await this.reviewsRepository.placeExists(placeId))){
      throw new NotFoundException(`L'endroit avec l'id '${placeId}' n'existe pas.`)
    }

    const newReview = await this.reviewsRepository.create({ placeId, ...createReviewDto })

    this.eventEmitter.emit("review.changed", { placeId });

    return newReview;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.findAll();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findById(id)
    if(!review){
      throw new NotFoundException(`L'avis avec l'id '${id}' n'existe pas.`)
    }
    return review
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewsRepository.updateById(id, { ...updateReviewDto })
    if(!review){
      throw new NotFoundException(`L'avis avec l'id '${id}' n'existe pas.`)
    }

    this.eventEmitter.emit('review.changed', { placeId: review.placeId });

    return review
  }

  async remove(id: string): Promise<void> {
    const deletedReview = await this.reviewsRepository.deleteById(id)
    if(!deletedReview){
      throw new NotFoundException(`L'avis avec l'ID "${id}" n'existe pas.`);
    }

    this.eventEmitter.emit('review.changed', { placeId: deletedReview.placeId });
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    return this.reviewsRepository.findByPlace(placeId);
  }
}