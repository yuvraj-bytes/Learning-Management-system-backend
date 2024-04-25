import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ErrorHandlerService } from './error-handler.service';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly errorHandlerService: ErrorHandlerService,
    ) { }

    async sendEmail(to: string, subject: string, ejsHtml: string): Promise<ResponseDto> {

        try {
            const transporter = await nodemailer.createTransport({
                service: this.configService.get('SMTP_HOST'),
                auth: {
                    user: this.configService.get<string>('SMTP_USER'),
                    pass: this.configService.get<string>('SMTP_PASS'),
                }
            });

            const mailOptions = {
                from: this.configService.get<string>('SMTP_USER'),
                to,
                subject,
                html: ejsHtml,
            };

            return await transporter.sendMail(mailOptions);
        } catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}
