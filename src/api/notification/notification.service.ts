import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateNotificationDto } from "./dto/create-notification";
import { Notification } from "./schema/notificcation.schema";
import { ResponseDto } from "src/common/dto/response.dto";
import { MESSAGE } from "src/constants/constants";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto): Promise<ResponseDto> {
        const createdNotification = new this.notificationModel(createNotificationDto);
        createdNotification.save();
        return { statusCode: HttpStatus.OK, message: MESSAGE.NOTIFICATION_CREATED }
    }

    async findAll(): Promise<ResponseDto> {
        const notification = await this.notificationModel.find().exec();
        return { statusCode: HttpStatus.OK, message: MESSAGE.NOTIFCATION_LIST, data: notification }
    }
}
