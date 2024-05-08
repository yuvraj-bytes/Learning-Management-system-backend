import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Lesson, LessonSchema } from "./schema/lesson.schema";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";
import { MulterModule } from "@nestjs/platform-express";
import { Course, CourseSchema } from "../course/schema/course.schema";
import { EmailService } from "src/utills/email.service";
import { ErrorHandlerService } from "src/utills/error-handler.service";
import { NotificationService } from "src/utills/notification.service";
import { Notification, NotificationSchema } from "../notification/schema/notificcation.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }, { name: Course.name, schema: CourseSchema }, {
            name: Notification.name, schema: NotificationSchema
        }]),
        MulterModule.register({
            dest: './assets'
        })

    ],
    controllers: [LessonController],
    providers: [LessonService, EmailService, ErrorHandlerService, NotificationService],
    exports: [LessonService],
})

export class LessonModule { }