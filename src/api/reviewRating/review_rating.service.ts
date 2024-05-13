
import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewRating } from './schema/review-rating.schema';
import { ReviewRatingDto } from './dto/review-rating.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { MESSAGE } from 'src/constants/constants';
@Injectable()
export class ReviewRatingService {
    constructor(
        @InjectModel(ReviewRating.name)
        private readonly reviewRatingModel: Model<ReviewRating>,
    ) { }

    async createReviewRating(reviewRatingDto: ReviewRatingDto): Promise<ResponseDto> {
        const createdReviewRating = new this.reviewRatingModel(reviewRatingDto);
        createdReviewRating.save();
        return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_ADDED, data: createdReviewRating }
    }

    async getReviewsRatingsByCourseId(courseId: string): Promise<ResponseDto> {
        console.log("🚀 ~ ReviewRatingService ~ getReviewsRatingsByCourseId ~ courseId:", courseId)
        const data = await this.reviewRatingModel.find({ courseId });
        console.log("🚀 ~ ReviewRatingService ~ getReviewsRatingsByCourseId ~ data:", data)
        return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data }
    }

    async getReviewsRatingsByUserId(userId: string): Promise<ResponseDto> {
        const data = await this.reviewRatingModel.find({ userId }).exec();
        return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data }
    }

    async getReviewRatings(): Promise<ResponseDto> {
        const data = await this.reviewRatingModel.find().exec();
        return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data }
    }
}
