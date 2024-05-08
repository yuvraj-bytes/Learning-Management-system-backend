import { HttpStatus, Injectable } from "@nestjs/common";
import { Lesson } from "./schema/lesson.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ConfigService } from "@nestjs/config";
import * as cloudinary from 'cloudinary';
import { MESSAGE } from "src/constants/constants";
import { ResponseDto } from "src/common/dto/response.dto";
import { EmailService } from "src/utills/email.service";
import * as ejs from 'ejs';
import * as path from 'path';
import * as pdf from 'html-pdf';
import { NotificationType, NotificationService } from "src/utills/notification.service";

@Injectable()
export class LessonService {

    constructor(@InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson>,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly notificationService: NotificationService) { }

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

        await this.notificationService.sendNotification(MESSAGE.LESSON_CREATED, MESSAGE.LESSON_CREATED_MSG(lesson.title), NotificationType.INFO);

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

    async generateCertificate(userdata: any): Promise<ResponseDto> {
        try {
            const certificateTemplate = path.join(process.cwd(), 'src/certificate', this.configService.get('CERTIFICATE_FILE_NAME').toString());
            const certificateData = await new Promise<string>((resolve, reject) => {
                ejs.renderFile(certificateTemplate, { name: userdata.username }, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            const pdfOptions = {
                height: "11.25in",
                width: "8.5in",
                header: {
                    height: "20mm"
                },
                footer: {
                    height: "20mm",
                },
            };

            const pdfFilePath = "certificate.pdf";
            const pdfCreationPromise = new Promise<void>((resolve, reject) => {
                pdf.create(certificateData, pdfOptions).toFile(pdfFilePath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            await pdfCreationPromise;
            const sendMailPromise = this.emailService.sendEmail(userdata.email, MESSAGE.CERTIFICATE_OF_COMPLETION, pdfFilePath);
            const sendMailResult = await sendMailPromise;

            if (!sendMailResult) {
                return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGE.EMAIL_SEND_FAILED };
            }

            await this.notificationService.sendNotification(MESSAGE.COURSE_COMPLITION, MESSAGE.CERTIFICATE_SENT_MSG(userdata.email), NotificationType.INFO);
            return { statusCode: HttpStatus.OK, message: MESSAGE.CERTIFICATE_SENT };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGE.INTERNAL_SERVER_ERROR };
        }
    }
}