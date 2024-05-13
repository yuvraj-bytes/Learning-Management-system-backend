// review-rating.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ReviewRating extends Document {
    @Prop({ required: true })
    courseId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    review: string;

    @Prop({ required: true })
    rating: number;
}

export const ReviewRatingSchema = SchemaFactory.createForClass(ReviewRating);
