import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ReviewRating } from './schema/review-rating.schema';
import { ReviewRatingDto } from './dto/review-rating.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { MESSAGE } from '../../constants/constants';
import { ErrorHandlerService } from '../../utills/error-handler.service';
import { Course } from '../course/schema/course.schema';
@Injectable()
export class ReviewRatingService {
    constructor(
        @InjectModel(ReviewRating.name) private reviewRatingModel: Model<ReviewRating>,
        @InjectModel(Course.name) private courseModel: Model<Course>,
        private readonly errorHandlerService: ErrorHandlerService,
    ) { }

    async createReviewRating(reviewRatingDto: ReviewRatingDto, userData: any): Promise<ResponseDto> {
        try {

            const courseId = reviewRatingDto.courseId;
            const averageRatingData = await this.reviewRatingModel.aggregate([
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
            const createdReviewRating = new this.reviewRatingModel(reviewRatingDto);
            createdReviewRating.userId = userData.userId;

            createdReviewRating.save();
            if (averageRatingData.length > 0) {
                const averageRating = averageRatingData[0].averageRating;
                await this.courseModel.updateOne({ _id: courseId }, { averageRating: averageRating });
            }

            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_ADDED, data: createdReviewRating };
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
                        'as': 'user'
                    }
                }, {
                    '$unwind': {
                        'path': '$user',
                        'preserveNullAndEmptyArrays': true
                    }
                },
                {
                    '$project': {
                        'user.first_name': 1,
                        'user.last_name': 1,
                        'user.email': 1,
                        'user.role': 1,
                        'user.contact': 1,
                        'rating': 1,
                        'review': 1,
                        'courseId': 1
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
                },
                {
                    '$project': {
                        'userId.first_name': 1,
                        'userId.last_name': 1,
                        'userId.email': 1,
                        'userId.role': 1,
                        'userId.contact': 1,
                        'rating': 1,
                        'review': 1,
                        'courseId.title': 1,
                        'courseId.description': 1,
                        'courseId.price': 1,
                        'courseId.averageRating': 1
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

    async updateReviewRating(reviewRatingDto: ReviewRatingDto, reviewRatingId: string): Promise<ResponseDto> {
        try {
            const updatedReviewRating = await this.reviewRatingModel.findOneAndUpdate({ courseId: reviewRatingId }, reviewRatingDto, { new: true });
            // Update course data with average rating
            const courseId = reviewRatingId;
            const averageRatingData = await this.reviewRatingModel.aggregate([
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
            if (averageRatingData.length > 0) {
                const averageRating = averageRatingData[0].averageRating;
                await this.courseModel.updateOne({ _id: courseId }, { averageRating: averageRating });
            }
            return { statusCode: HttpStatus.OK, message: MESSAGE.REVIEW_RATING_UPDATED, data: updatedReviewRating }
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}
