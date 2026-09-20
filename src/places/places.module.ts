import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [ReviewsModule],
})
export class PlacesModule {}
