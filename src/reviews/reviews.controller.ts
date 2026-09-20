import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Query('placeId') placeId: string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(placeId, createReviewDto);
  }

  @Get()
  findAll(): Review[] {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Review {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto): Review {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.reviewsService.remove(id);
  }
  
  @Get('/places/:placeId')
  findByPlace(@Param('placeId') placeId: string): Review[] {
    return this.reviewsService.findByPlace(placeId);
  }
}
