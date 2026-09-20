import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class ReviewsService {
  private reviews: Review[] = []

  constructor(private readonly eventEmitter: EventEmitter2) {}

  create(placeId: string, createReviewDto: CreateReviewDto) {
    if (!placeId) {
      throw new NotFoundException(`L'id de l'endroit est requis pour créer une critique.`)
    }

    const now = new Date().toISOString()
    const newReview: Review = {
      id: `rev_${randomUUID().substring(0, 8)}`,
      placeId: placeId,
      ...createReviewDto,
      createdAt: now,
      updatedAt: now
    }

    this.reviews.push(newReview)

    this.eventEmitter.emit("review.changed", { placeId });

    return newReview;
  }

  findAll() {
    return this.reviews;
  }

  findOne(id: string) {
    const review = this.reviews.find((r) => r.id === id)
    if(!review){
      throw new NotFoundException(`La critique avec l'id '${id}' n'existe pas.`)
    }
    return review
  }

  update(id: string, updateReviewDto: UpdateReviewDto) {
    const review: Review = this.findOne(id)
    Object.assign(review,updateReviewDto)
    review.updatedAt = new Date().toISOString()

    return review
  }

  remove(id: string) {
    const index: number =  this.reviews.findIndex((review: Review) => review.id === id);
    if(index === -1){
      throw new NotFoundException(`La critique avec l'ID "${id}" n'existe pas.`);
    }

    const deletedReview = this.reviews.splice(index, 1)[0];

    this.eventEmitter.emit('review.changed', { placeId: deletedReview.placeId });
  }

  findByPlace(placeId: string) {
    return this.reviews.filter((r) => r.placeId === placeId);
  }
}
