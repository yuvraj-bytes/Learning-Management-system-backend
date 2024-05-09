import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificationType } from "src/api/notification/enum/notification.enum";
import { Notification } from "src/api/notification/schema/notificcation.schema";
import { ResponseDto } from "src/common/dto/response.dto";
import { MESSAGE, NOTIFICATION, NOTIFICATION_TITLE } from "src/constants/constants";
@Injectable()
export class NotificationService {

    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) {
    }

    async sendNotification(title: string, content: string, type: NotificationType): Promise<ResponseDto> {
        try {
            const createdNotification = new this.notificationModel({ title, content, type });
            createdNotification.save();
            return { statusCode: HttpStatus.OK, message: NOTIFICATION_TITLE.NOTIFICATION_CREATED }
        } catch (error) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: error.message }
        }
    }
}
