import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ReviewsService } from './reviews.service';
import { UserGuard } from '../auth/jwt-auth.guard';

class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

@Controller('businesses/:id/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findByBusiness(id);
  }

  @Post()
  @UseGuards(UserGuard)
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    return this.reviewsService.create(id, req.user.id, dto.rating, dto.comment);
  }
}
