import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Answer } from './answer.schema';

@Schema({ timestamps: true })
export class Question extends Document {
    @Prop({ required: true })
    lessonId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    question: string;

    @Prop({ default: [] })
    answers: Answer[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
