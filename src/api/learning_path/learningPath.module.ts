import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Course, CourseSchema } from "../course/schema/course.schema";
import { User, UserSchema } from "../users/schema/user.schema";
import { Lesson, LessonSchema } from "../lesson/schema/lesson.schema";
import { Notification, NotificationSchema } from "../notification/schema/notificcation.schema";
import { LearningPathController } from "./learningPath.controller";
import { LearningPathService } from "./learningPath.service";
import { ErrorHandlerService } from "src/utills/error-handler.service";
import { NotificationService } from "src/utills/notification.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }, { name: User.name, schema: UserSchema }, { name: Lesson.name, schema: LessonSchema }, { name: Notification.name, schema: NotificationSchema }]),
    ],
    controllers: [LearningPathController],
    providers: [LearningPathService, ErrorHandlerService, NotificationService],
    exports: [LearningPathService],
})

export class LearningPathModule { }
