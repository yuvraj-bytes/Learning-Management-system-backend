import { Module } from '@nestjs/common';
import { ReviewRatingController } from './review_rating.controller';
import { ReviewRatingService } from './review_rating.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ReviewRating, ReviewRatingSchema } from './schema/review-rating.schema';
import { ErrorHandlerService } from 'src/utills/error-handler.service';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: ReviewRating.name, schema: ReviewRatingSchema }]),
        MulterModule.register({
            dest: './assets'
        }),
    ],
    controllers: [ReviewRatingController],
    providers: [ReviewRatingService, ErrorHandlerService],
    exports: [ReviewRatingService]
})
export class ReviewRatingModule { }
