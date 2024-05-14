import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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

    async createReviewRating(reviewRatingDto: ReviewRatingDto, userData: any): Promise<ResponseDto> {
        try {
            const createdReviewRating = new this.reviewRatingModel(reviewRatingDto);
            createdReviewRating.userId = userData.userId;
            createdReviewRating.save();
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_ADDED, data: createdReviewRating }
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async getReviewsRatingsByCourseId(courseId: string): Promise<ResponseDto> {
        try {
            const data = await this.reviewRatingModel.aggregate([
                {
                    '$match': {
                        'courseId': new mongoose.Types.ObjectId(courseId)
                    }
                }, {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'userId',
                        'foreignField': '_id',
                        'as': 'userId'
                    }
                }, {
                    '$unwind': {
                        'path': '$userId',
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ]).exec();
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_FETCHED, data };
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async getReviewsRatingsByUserId(userData: any): Promise<ResponseDto> {
        try {
            const data = await this.reviewRatingModel.aggregate([
                {
                    '$match': {
                        'userId': new mongoose.Types.ObjectId(userData.userId)
                    }
                }, {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'userId',
                        'foreignField': '_id',
                        'as': 'userId'
                    }
                }, {
                    '$unwind': {
                        'path': '$userId',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'courses',
                        'localField': 'courseId',
                        'foreignField': '_id',
                        'as': 'courseId'
                    }
                }, {
                    '$unwind': {
                        'path': '$courseId',
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ]).exec();
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

    async getOverallCourseReview(courseId: string): Promise<ResponseDto> {
        try {
            const data = await this.reviewRatingModel.aggregate([
                {
                    '$match': {
                        'courseId': new mongoose.Types.ObjectId(courseId)
                    }
                }, {
                    '$group': {
                        '_id': '$courseId',
                        'averageRating': { '$avg': '$rating' },
                        'totalReviews': { '$sum': 1 }
                    }
                }
            ]).exec();
            if (data.length === 0) {
                return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND, data: null };
            }
            const overallRating = data[0].averageRating;
            const totalReviews = data[0].totalReviews;
            return { statusCode: HttpStatus.OK, message: MESSAGE.GET_OVERALL_RATING, data: { overallRating, totalReviews } };
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}
