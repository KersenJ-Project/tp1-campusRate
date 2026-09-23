import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';
import type { Response } from 'express';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel avis pour un lieu' })
  @ApiQuery({ name: 'placeId', required: true, description: "L'identifiant unique du lieu concerné", example: 'plc_91cc99fd' })
  @ApiResponse({ status: HttpStatus.CREATED, description: "L'avis a été créé avec succès.", type: Review })
  @ApiHeader({ name: 'Location', description: 'URI du nouvel avis créé (ex: /api/v1/reviews/rev_12345678)' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données de requête invalides.', type: ProblemDetailsDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Identifiant du lieu inexistant ou manquant.', type: ProblemDetailsDto })
  async create(@Query('placeId') placeId: string, @Body() createReviewDto: CreateReviewDto, @Res({ passthrough: true }) response: Response): Promise<Review> {
    const newReview = await this.reviewsService.create(placeId, createReviewDto);

    response.setHeader('Location', `/api/v1/reviews/${newReview.id}`);
    response.status(HttpStatus.CREATED);

    return newReview;
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer l’ensemble des avis' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Liste de tous les avis récupérée avec succès.', type: [Review] })
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un avis par son identifiant' })
  @ApiParam({ name: 'id', description: "Identifiant unique de l'avis", example: 'rev_12345678' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Avis trouvé.', type: Review })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Avis non trouvé.', type: ProblemDetailsDto })
  async findOne(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour partiellement un avis' })
  @ApiParam({ name: 'id', description: "Identifiant unique de l'avis", example: 'rev_12345678' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Avis mis à jour avec succès.', type: Review })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données de mise à jour invalides.', type: ProblemDetailsDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Avis non trouvé.', type: ProblemDetailsDto })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un avis' })
  @ApiParam({ name: 'id', description: "Identifiant unique de l'avis", example: 'rev_12345678' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Avis supprimé avec succès.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Avis non trouvé.', type: ProblemDetailsDto })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.reviewsService.remove(id);
  }

  @Get('/places/:placeId')
  @ApiOperation({ summary: 'Récupérer tous les avis d’un lieu spécifique' })
  @ApiParam({ name: 'placeId', description: "Identifiant unique du lieu", example: 'plc_91cc99fd' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Avis associés au lieu récupérés avec succès.', type: [Review] })
  async findByPlace(@Param('placeId') placeId: string): Promise<Review[]> {
    return await this.reviewsService.findByPlace(placeId);
  }
}