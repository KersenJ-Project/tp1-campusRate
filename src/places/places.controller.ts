import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import type { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { GetPlacesDto } from './dto/get-places.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  findAll(@Query() queryDto: GetPlacesDto): PaginatedResult<Place> {
    return this.placesService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Place {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.placesService.remove(id);
  }
}
