import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
@Schema()
export class Answer {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    userId: string;

    @Prop({ required: true })
    answers: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);