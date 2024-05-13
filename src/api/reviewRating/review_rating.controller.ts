import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewRatingDto } from './dto/review-rating.dto';
import { ReviewRatingService } from './review_rating.service';
import { ResponseDto } from 'src/common/dto/response.dto';
@Controller('reviews-ratings')
export class ReviewRatingController {
    constructor(private readonly reviewRatingService: ReviewRatingService) { }

    @Post()
    async createReviewRating(@Body() reviewRatingDto: ReviewRatingDto): Promise<ResponseDto> {
        return await this.reviewRatingService.createReviewRating(reviewRatingDto);
    }

    @Get()
    async getReviewRatings(): Promise<ResponseDto> {
        return await this.reviewRatingService.getReviewRatings();
    }

    @Get('course/:courseId')
    async getReviewsRatingsByCourseId(@Param() courseId: string): Promise<ResponseDto> {
        return await this.reviewRatingService.getReviewsRatingsByCourseId(courseId);
    }

    @Get('user/:userId')
    async getReviewsRatingsByUserId(@Body() userId: string): Promise<ResponseDto> {
        return await this.reviewRatingService.getReviewsRatingsByUserId(userId);
    }
}
