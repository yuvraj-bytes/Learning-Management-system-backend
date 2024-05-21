import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Course {

    _id: string;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop()
    instructor_id: string;

    @Prop()
    image: string;

    @Prop()
    product_id: string;

    @Prop()
    price_id: string;

    @Prop()
    raating: number;

    @Prop({ required: false })
    averageRating: number;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);