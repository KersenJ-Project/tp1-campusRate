import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PlacesModule } from '../places/places.module';

@Module({
  exports: [ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
