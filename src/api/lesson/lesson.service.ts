import { HttpStatus, Injectable } from "@nestjs/common";
import { createReadStream, statSync } from 'fs';
import { Lesson } from "./schema/lesson.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ConfigService } from "@nestjs/config";
import * as cloudinary from 'cloudinary';
import { MESSAGE } from "src/constants/constants";
import { ResponseDto } from "src/common/dto/response.dto";
@Injectable()
export class LessonService {

    constructor(@InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson>,
        private readonly configService: ConfigService) { }

    async createLesson(lesson: CreateLessonDto, files: any): Promise<ResponseDto> {
        const existingLesson = await this.lessonTable.findOne({ title: lesson.title });
        if (existingLesson) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.LESSON_ALREADY_EXISTS };
        }

        const createdLesson = new this.lessonTable(lesson);

        cloudinary.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });

        for (const file of files) {
            if (file.originalname.endsWith('.mp4')) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    resource_type: 'video',
                    folder: 'lesson_video'
                });
                createdLesson.video_url = result.secure_url;
            } else {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "lesson_thumbnail",
                });
                createdLesson.thumbnail = result.secure_url;
            }
        }
        await createdLesson.save();

        return { statusCode: HttpStatus.OK, message: MESSAGE.LESSON_CREATED, data: createdLesson };
    }

    async getAllLessons(course_id: string): Promise<ResponseDto> {
        const filteredCourses = await this.lessonTable.find({ course_id: course_id });
        return { statusCode: HttpStatus.OK, message: MESSAGE.LESSON_LIST, data: filteredCourses };
    }

    async setLessonCompleted(id: string): Promise<ResponseDto> {
        const lesson = await this.lessonTable.findByIdAndUpdate(
            id,
            { completed: true }
        );
        return { statusCode: HttpStatus.OK, message: MESSAGE.LESSON_COMPLETED };
    }
}