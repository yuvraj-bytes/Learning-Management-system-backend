import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schema/user.schema";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { Course, CourseSchema } from "./schema/course.schema";
import { Lesson, LessonSchema } from "../lesson/schema/lesson.schema";
import { Enrollment, EnrollmentsSchema } from "./schema/enrollments.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }, { name: User.name, schema: UserSchema }, { name: Lesson.name, schema: LessonSchema }, { name: Enrollment.name, schema: EnrollmentsSchema }]),
    ],
    controllers: [CourseController],
    providers: [CourseService],
    exports: [CourseService],
})

export class CourseModule { }