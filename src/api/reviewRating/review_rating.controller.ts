import { Controller, Post, Body } from '@nestjs/common';
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
}
