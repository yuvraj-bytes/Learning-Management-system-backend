
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewRating } from './schema/review-rating.schema';
import { ReviewRatingDto } from './dto/review-rating.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { MESSAGE } from 'src/constants/constants';
import { ErrorHandlerService } from 'src/utills/error-handler.service';
@Injectable()
export class ReviewRatingService {
    constructor(
        @InjectModel(ReviewRating.name)
        private readonly reviewRatingModel: Model<ReviewRating>,
        private readonly errorHandlerService: ErrorHandlerService,
    ) { }

    async createReviewRating(reviewRatingDto: ReviewRatingDto): Promise<ResponseDto> {
        try {
            const createdReviewRating = new this.reviewRatingModel(reviewRatingDto);
            createdReviewRating.save();
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_ADDED, data: createdReviewRating }
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async getReviewsRatingsByCourseId(courseId: string): Promise<ResponseDto> {
        try {
            const data = await this.reviewRatingModel.find({ courseId: courseId });
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data };
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async getReviewsRatingsByUserId(userId: any): Promise<ResponseDto> {
        try {
            const data = await this.reviewRatingModel.find({ userId: userId.userId }).exec();
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data }
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async getReviewRatings(): Promise<ResponseDto> {
        try {

            const data = await this.reviewRatingModel.find().exec();
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data }
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}
