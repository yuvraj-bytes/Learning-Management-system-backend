import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { QAService } from './qa.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/guard/getUser.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('QA')
@Controller('QA')
export class QAController {
    constructor(private readonly questionsService: QAService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createQuestion(@Body() createQuestionDto: CreateQuestionDto, @GetUser() userData): Promise<ResponseDto> {
        return this.questionsService.createQuestion(createQuestionDto, userData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('answer')
    async addAnswer(@Body() createAnswerDto: CreateAnswerDto, @GetUser() userData): Promise<ResponseDto> {
        return this.questionsService.addAnswer(createAnswerDto, userData);
    }

    @Get('lesson/:lessonId')
    async findAllQuestionsByLesson(@Param('lessonId') lessonId: string): Promise<ResponseDto> {
        return this.questionsService.findAllQuestionsByLesson(lessonId);
    }
}
