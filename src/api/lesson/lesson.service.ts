import { HttpStatus, Injectable } from "@nestjs/common";
import { createReadStream, statSync } from 'fs';
import { Lesson } from "./schema/lesson.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { join } from 'path';
import { createWriteStream } from 'fs';
import { extname } from 'path';
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ConfigService } from "@nestjs/config";
import * as cloudinary from 'cloudinary';
import { MESSAGE } from "src/constants/constants";
@Injectable()
export class LessonService {

    constructor(@InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson | any>,
        private readonly configService: ConfigService) { }

    async createLesson(lesson: CreateLessonDto, files: any): Promise<any> {
        const existingLesson = await this.lessonTable.findOne({ title: lesson.title });
        if (existingLesson) {
            return { status: HttpStatus.BAD_REQUEST, message: 'Lesson already exists.' };
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

        return { status: HttpStatus.OK, message: MESSAGE.LESSON_CREATED, createdLesson };
    }

    async addVideoLesson(videoFile: Express.Multer.File, id: string): Promise<Lesson> {
        if (!videoFile || !videoFile.filename) {
            throw new Error('Video file is missing or filename is not defined.');
        }

        const allowedExtensions = ['.mp3', '.mp4'];
        const fileExtension = extname(videoFile.originalname);
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Only .mp3 or .mp4 files are allowed.');
        }

        const videoPath = join(process.cwd(), 'assets', `${videoFile.originalname}`);
        const writeStream = createWriteStream(videoPath);
        // writeStream.write(videoFile.buffer);
        writeStream.end();

        const createdLesson = this.lessonTable.findByIdAndUpdate(
            id,
            {
                video_url: videoFile.path,
            },
            { new: false }
        );

        return createdLesson;
    }

    async getVideoStream(id: any, headers: any, res: any) {
        const videoPath = `assets/${id}`;
        const { size } = statSync(videoPath);
        const videoRange = headers.range;
        const parts = videoRange?.replace(/bytes=/, '').split('-');
        const start = parseInt(parts?.[0], 10) || 0;
        const end = parts?.[1] ? parseInt(parts[1], 10) : size - 1;

        const chunksize = end - start + 1;
        const readStreamfile = createReadStream(videoPath, {
            start,
            end,
            highWaterMark: 60,
        });

        const head = {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Length': chunksize,
        };
        res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
        readStreamfile.pipe(res);
    }

    async getAllLessons(course_id: string) {
        const filteredCourses = await this.lessonTable.find({ course_id: course_id });
        return filteredCourses;
    }

    async setLessonCompleted(id: string): Promise<Lesson> {
        const lesson = await this.lessonTable.findByIdAndUpdate(
            id,
            { completed: true }
        );
        return lesson;
    }
}