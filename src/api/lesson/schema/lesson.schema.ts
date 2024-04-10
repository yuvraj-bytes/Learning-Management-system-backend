import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Lesson {

    _id: string;

    @Prop({ default: 'Lesson' })
    title: string;

    @Prop({ default: 'Content' })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'courses' })
    course_id: String;

    @Prop({ default: '' })
    video_url: string;

    @Prop({ default: false })
    completed: boolean;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);