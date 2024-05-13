import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class ReviewRating extends Document {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'courses' })
    courseId: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    userId: string;

    @Prop({ required: true })
    review: string;

    @Prop({ required: true })
    rating: number;
}

export const ReviewRatingSchema = SchemaFactory.createForClass(ReviewRating);
