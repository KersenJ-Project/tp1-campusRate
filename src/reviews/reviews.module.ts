import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from './schemas/review.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from '../places/schemas/place.schema';

@Module({
  exports: [ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }, { name: Place.name, schema: PlaceSchema },]),]
})
export class ReviewsModule {}
