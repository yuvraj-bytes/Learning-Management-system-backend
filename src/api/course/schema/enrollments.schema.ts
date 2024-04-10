import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Enrollment {

    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    user_id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'courses' })
    course_id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'lessons' })
    lesson_id: string;

    @Prop({ default: false })
    completed: boolean;

    @Prop({ default: Date.now })
    enrolled_at: Date;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const EnrollmentsSchema = SchemaFactory.createForClass(Enrollment);