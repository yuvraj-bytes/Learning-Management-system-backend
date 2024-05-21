import { Module } from '@nestjs/common';
import { ReviewRatingController } from './review_rating.controller';
import { ReviewRatingService } from './review_rating.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewRating, ReviewRatingSchema } from './schema/review-rating.schema';
import { ErrorHandlerService } from '../../utills/error-handler.service';
import { Course, CourseSchema } from '../course/schema/course.schema';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: ReviewRating.name, schema: ReviewRatingSchema }, { name: Course.name, schema: CourseSchema }])
    ],
    controllers: [ReviewRatingController],
    providers: [ReviewRatingService, ErrorHandlerService],
    exports: [ReviewRatingService]
})
export class ReviewRatingModule { }
