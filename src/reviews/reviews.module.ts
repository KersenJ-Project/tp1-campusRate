import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from './schemas/review.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from '../places/schemas/place.schema';
import { ReviewsRepository } from './reviews.repository';

@Module({
  exports: [ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }, { name: Place.name, schema: PlaceSchema },]),]
})
export class ReviewsModule {}
