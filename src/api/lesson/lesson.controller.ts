import { Body, Controller, Get, Header, Headers, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { Response } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import { Lesson } from "./schema/lesson.schema";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import * as path from "path";
import * as fs from "fs";
import { AuthGuard } from "@nestjs/passport";

@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) { }

    @Post('createLesson')
    async createLesson(@Body() lesson: CreateLessonDto): Promise<Lesson> {
        return this.lessonService.createLesson(lesson);
    }

    @Post('addVideoLesson/:id')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('videoFile'))
    async addVideoLesson(@UploadedFile() videoFile: Express.Multer.File, @Param('id') id: string): Promise<any> {
        const lesson = await this.lessonService.addVideoLesson(videoFile, id);
        return lesson;
    }

    @Get('stream/:id')
    @Header('Accept-Ranges', 'bytes')
    @Header('Content-Type', 'video/mp4')
    async streamVideo(@Param('id') id: string, @Headers() headers: any, @Res() res: Response) {
        return this.lessonService.getVideoStream(id, headers, res);
    }

    @Get('getLessonList/:id')
    @UseGuards(AuthGuard('jwt'))
    async getAllLessons(@Param('id') course_id: string): Promise<any> {
        return this.lessonService.getAllLessons(course_id);
    }

    @Post('setLessonCompleted/:id')
    async setLessonCompleted(@Param('id') id: string): Promise<any> {
        return this.lessonService.setLessonCompleted(id);
    }

    @Get('download')
    async downloadCertificate(@Res() res: Response) {
        const filePath = path.join(process.cwd(), 'assets', 'redis_commands.pdf');
        const stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=dummy-certificate.pdf');
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    }
} 
