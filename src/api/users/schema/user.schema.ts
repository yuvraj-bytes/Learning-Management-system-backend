import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PrimaryGeneratedColumn } from 'typeorm';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    _id: string;

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    contact: string;

    @Prop({ type: 'string', default: 'user' })
    role: string;

    @Prop()
    course: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);