import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './schema/question.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { MESSAGE, NOTIFICATION, NOTIFICATION_TITLE } from 'src/constants/constants';
import { NotificationService } from 'src/utills/notification.service';
import { NotificationType } from '../notification/enum/notification.enum';

@Injectable()
export class QAService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>,
        private readonly notificationService: NotificationService
    ) { }

    async createQuestion(createQuestionDto: CreateQuestionDto, userData: any): Promise<ResponseDto> {
        try {
            const newQuestion = new this.questionModel({
                ...createQuestionDto,
                userId: userData.userId,
            });
            await newQuestion.save();
            if (newQuestion) {
                await this.notificationService.sendNotification(
                    NOTIFICATION_TITLE.QUESTION_CREATED,
                    NOTIFICATION.QUESTION_ADDED_CONTENT(userData.username),
                    NotificationType.INFO,
                );
                return { statusCode: HttpStatus.CREATED, message: MESSAGE.QUESTION_CREATED, data: newQuestion }
            }
        }
        catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
        }
    }

    async addAnswer(createAnswerDto: CreateAnswerDto, userData: any): Promise<ResponseDto> {
        try {
            const question = await this.questionModel.findById(createAnswerDto.questionId);
            if (!question) {
                return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.QUESTION_NOT_FOUND }
            }

            if (question.userId !== userData.userId) {
                return { statusCode: HttpStatus.UNAUTHORIZED, message: MESSAGE.INVALID_CREDENTIALS }
            }

            question.answers.push({
                userId: userData.userId,
                answers: createAnswerDto.answer,
            });
            await question.save();
            return { statusCode: HttpStatus.CREATED, message: MESSAGE.ANSWER_ADDED, data: question }
        }
        catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
        }
    }

    async findAllQuestionsByLesson(lessonId: string): Promise<ResponseDto> {
        try {
            const response = await this.questionModel.find({ lessonId }).exec();
            if (!response) {
                return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.QUESTION_NOT_FOUND }
            }
            return { statusCode: HttpStatus.OK, message: MESSAGE.QUESTION_LIST, data: response }
        }
        catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
        }
    }
}
