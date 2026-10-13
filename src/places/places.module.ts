import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { ReviewsModule } from '../reviews/reviews.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './schemas/place.schema';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [
    ReviewsModule,
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
  ],
})
export class PlacesModule {}
