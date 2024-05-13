import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schema/user.schema";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { Course, CourseSchema } from "./schema/course.schema";
import { Lesson, LessonSchema } from "../lesson/schema/lesson.schema";
import { Enrollment, EnrollmentsSchema } from "./schema/enrollments.schema";
import { Order, OrderSchema } from "./schema/order.schema";
import { StripeService } from "../stripe/ stripe.service";
import { UploadImageService } from "../../utills/upload-image";
import { NotificationService } from "../../utills/notification.service";
import { Notification, NotificationSchema } from "../notification/schema/notificcation.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }, { name: User.name, schema: UserSchema }, { name: Lesson.name, schema: LessonSchema }, { name: Enrollment.name, schema: EnrollmentsSchema }, { name: Order.name, schema: OrderSchema }, { name: Notification.name, schema: NotificationSchema }]),
    ],
    controllers: [CourseController],
    providers: [CourseService, StripeService, UploadImageService, NotificationService],
    exports: [CourseService],
})

export class CourseModule { }