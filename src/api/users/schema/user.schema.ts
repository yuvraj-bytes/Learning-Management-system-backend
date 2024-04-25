import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
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

    @Prop()
    resetToken: string;

    @Prop()
    resetTokenExpiration: Date;

    @Prop({ type: 'string', default: '' })
    stripeCustomerId: string;

    async setPassword(password: string): Promise<void> {
        this.password = await bcrypt.hash(password, 10);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});
