import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = []

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
    return newReview
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

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: string) {
    const index: number =  this.reviews.findIndex((review: Review) => review.id === id);
    if(index === -1){
      throw new NotFoundException(`La critique avec l'ID "${id}" n'existe pas.`);
    }

    this.reviews.splice(index, 1);
  }
}
