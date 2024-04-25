import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Order {

    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
    user_id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'courses' })
    course_id: string;

    @Prop({ default: '' })
    transaction_id: string;

    @Prop({ default: 0 })
    amount: number;

    @Prop({ default: '' })
    customer_id: string;

    @Prop({ default: '' })
    product_id: string;

    @Prop({ default: '' })
    price_id: string;

    @Prop({ default: '' })
    payment_status: string;

    @Prop({ default: '' })
    platform: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);