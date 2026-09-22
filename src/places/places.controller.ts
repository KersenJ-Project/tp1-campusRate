import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import type { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { GetPlacesDto } from './dto/get-places.dto';
import type { Response } from 'express';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto, @Res({ passthrough: true}) response: Response): Promise<Place> {
    const newPlace = await this.placesService.create(createPlaceDto);

    response.setHeader("Location", `/api/v1/places/${newPlace.id}`)
    response.status(HttpStatus.CREATED)

    return newPlace
  }

  @Get()
  async findAll(@Query() queryDto: GetPlacesDto): Promise<PaginatedResult<Place>> {
    return await this.placesService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Place> {
    return await this.placesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    return await this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.placesService.remove(id);
  }
}
