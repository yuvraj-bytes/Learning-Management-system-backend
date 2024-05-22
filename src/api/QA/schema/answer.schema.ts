import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Answer {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    answers: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);