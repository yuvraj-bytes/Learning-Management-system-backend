import { Body, Controller, Get, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto } from "src/common/dto/response.dto";
import { GetUser } from "../users/guard/getUser.guard";
import { RolesGuard } from "../auth/guard/role.guard";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('lesson')
@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) { }

    @Post('createLesson')
    @UseInterceptors(FilesInterceptor('file'))
    async createLesson(@Body() lesson: CreateLessonDto, @UploadedFiles() files: any): Promise<ResponseDto> {
        return this.lessonService.createLesson(lesson, files);
    }

    @Get('getLessonList/:id')
    @UseGuards(AuthGuard('jwt'))
    async getAllLessons(@Param('id') course_id: string): Promise<ResponseDto> {
        return this.lessonService.getAllLessons(course_id);
    }

    @Post('setLessonCompleted/:id')
    async setLessonCompleted(@Param('id') id: string): Promise<ResponseDto> {
        return this.lessonService.setLessonCompleted(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('generate-certificate')
    async generateCertificate(@GetUser() userdata: any): Promise<ResponseDto> {
        return this.lessonService.generateCertificate(userdata);
    }
} 
