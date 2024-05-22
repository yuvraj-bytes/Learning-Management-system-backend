import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorHandlerService } from '../../utills/error-handler.service';
import { Question, QuestionSchema } from './schema/question.schema';
import { Answer, AnswerSchema } from './schema/answer.schema';
import { QAController } from './qa.controller';
import { QAService } from './qa.service';
import { NotificationService } from 'src/utills/notification.service';
import { Notification, NotificationSchema } from '../notification/schema/notificcation.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }, { name: Answer.name, schema: AnswerSchema }, { name: Notification.name, schema: NotificationSchema }])
    ],
    controllers: [QAController],
    providers: [QAService, ErrorHandlerService, NotificationService],
    exports: [QAService]
})

export class QAModule { }
