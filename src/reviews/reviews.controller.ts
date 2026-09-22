import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import type { Response } from 'express';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Query('placeId') placeId: string, @Body() createReviewDto: CreateReviewDto, @Res({ passthrough: true}) response: Response) {
    const newReview = await this.reviewsService.create(placeId, createReviewDto);

    response.setHeader('Location', `/api/v1/reviews/${newReview.id}`)
    response.status(HttpStatus.CREATED)

    return newReview
  }

  @Get()
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.reviewsService.remove(id);
  }
  
  @Get('/places/:placeId')
  async findByPlace(@Param('placeId') placeId: string): Promise<Review[]> {
    return await this.reviewsService.findByPlace(placeId);
  }
}
