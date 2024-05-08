import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification";
import { ResponseDto } from "src/common/dto/response.dto";

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('/create-notification')
    async create(@Body() createNotificationDto: CreateNotificationDto): Promise<ResponseDto> {
        try {
            return this.notificationService.create(createNotificationDto);
        }
        catch (error) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: error.message }
        }
    }

    @Get('/getAllNotification')
    async findAll(): Promise<ResponseDto> {
        try {
            return this.notificationService.findAll();
        }
        catch (error) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: error.message }
        }
    }
}