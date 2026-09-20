import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import { PlaceStatus } from './enums/placeStatus.enum';
import { randomUUID } from 'crypto';

@Injectable()
export class PlacesService {

  private places: Place[] = []

  create(createPlaceDto: CreatePlaceDto) {
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
    return newPlace
  }

  findAll() {
    return this.places;
  }

  findOne(id: string) {
    const place = this.places.find((p) => p.id === id)
    if(!place){
      throw new NotFoundException(`L'endroit avec l'id '${id}' n'existe pas.`)
    }
    return place
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
