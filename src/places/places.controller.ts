import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { GetPlacesDto } from './dto/get-places.dto';
import { Place } from './entities/place.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';
import type { Response } from 'express';
import { PaginatedResultDto } from '../common/interfaces/paginated-result.interface';

@ApiTags('Places')
@ApiExtraModels(PaginatedResultDto, Place)
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau lieu.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Le lieu a été créé avec succès.', type: Place })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données fournies invalides.', type: ProblemDetailsDto })
  @ApiHeader({ name: 'Location', description: 'URI de la ressource créée (ex: /api/v1/places/plc_12345678).' })
  async create(@Body() createPlaceDto: CreatePlaceDto, @Res({ passthrough: true }) response: Response): Promise<Place> {
    const newPlace = await this.placesService.create(createPlaceDto);

    response.setHeader('Location', `/api/v1/places/${newPlace.id}`);
    response.status(HttpStatus.CREATED);

    return newPlace;
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste paginée des lieux.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste paginée des lieux récupérée avec succès.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Place) },
            },
          },
        },
      ],
    },
  })
  async findAll(@Query() queryDto: GetPlacesDto): Promise<PaginatedResultDto<Place>> {
    return await this.placesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un lieu par son identifiant.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lieu trouvé.', type: Place })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Lieu introuvable.', type: ProblemDetailsDto })
  async findOne(@Param('id') id: string): Promise<Place> {
    return await this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour partiellement un lieu.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lieu mis à jour avec succès.', type: Place })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données fournies invalides.', type: ProblemDetailsDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Lieu introuvable.', type: ProblemDetailsDto })
  async update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    return await this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un lieu.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Lieu supprimé avec succès.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Lieu introuvable.', type: ProblemDetailsDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Impossible de supprimer un lieu qui possède des critiques rattachées.', type: ProblemDetailsDto })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.placesService.remove(id);
  }
}