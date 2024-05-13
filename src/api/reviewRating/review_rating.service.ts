
import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewRating } from './schema/review-rating.schema';
import { ReviewRatingDto } from './dto/review-rating.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ReviewRatingService {
    constructor(
        @InjectModel(ReviewRating.name)
        private readonly reviewRatingModel: Model<ReviewRating>,
    ) { }

    async createReviewRating(reviewRatingDto: ReviewRatingDto): Promise<ResponseDto> {
        const createdReviewRating = new this.reviewRatingModel(reviewRatingDto);
        createdReviewRating.save();
        return { statusCode: HttpStatus.OK, message: 'Review and rating created successfully', data: createdReviewRating }
    }

    async getReviewsRatingsByCourseId(courseId: string): Promise<ReviewRating[]> {
        return this.reviewRatingModel.find({ courseId }).exec();
    }

    async getReviewsRatingsByUserId(userId: string): Promise<ReviewRating[]> {
        return this.reviewRatingModel.find({ userId }).exec();
    }
}
