import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Notification {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    type: 'info' | 'warning' | 'error';

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
