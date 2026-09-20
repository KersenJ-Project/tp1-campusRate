import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = []

  create(createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
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

  update(i: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${i} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
