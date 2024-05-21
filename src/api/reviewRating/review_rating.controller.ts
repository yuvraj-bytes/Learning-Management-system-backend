import { Controller, Post, Body, Get, Param, UseGuards, Patch } from '@nestjs/common';
import { ReviewRatingDto } from './dto/review-rating.dto';
import { ReviewRatingService } from './review_rating.service';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../users/guard/getUser.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('reviews-ratings')
@Controller('reviews-ratings')
export class ReviewRatingController {
    constructor(private readonly reviewRatingService: ReviewRatingService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async createReviewRating(@Body() reviewRatingDto: ReviewRatingDto, @GetUser() userData: any): Promise<ResponseDto> {
        return await this.reviewRatingService.createReviewRating(reviewRatingDto, userData);
    }

    @Get()
    async getReviewRatings(): Promise<ResponseDto> {
        return await this.reviewRatingService.getReviewRatings();
    }

    @Get('course/:courseId')
    async getReviewsRatingsByCourseId(@Param('courseId') courseId: string): Promise<ResponseDto> {
        return await this.reviewRatingService.getReviewsRatingsByCourseId(courseId);
    }

    @Get('user')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getReviewsRatingsByUserId(@GetUser() userData: any): Promise<ResponseDto> {
        return await this.reviewRatingService.getReviewsRatingsByUserId(userData);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async updateReviewRating(@Param('id') id: string, @Body() reviewRatingDto: ReviewRatingDto): Promise<ResponseDto> {
        return await this.reviewRatingService.updateReviewRating(reviewRatingDto, id);
    }
}
