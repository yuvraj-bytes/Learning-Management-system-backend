import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ErrorHandlerService } from './error-handler.service';
@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly errorHandlerService: ErrorHandlerService,
    ) { }

    async sendEmail(to: string, subject: string, ejsFile: any, pdfFileName?: any): Promise<any> {

        try {
            const transporter = await nodemailer.createTransport({
                service: this.configService.get('SMTP_HOST'),
                auth: {
                    user: this.configService.get<string>('SMTP_USER'),
                    pass: this.configService.get<string>('SMTP_PASS'),
                }
            });

            let attachments = [];
            if (pdfFileName) {
                attachments.push({
                    filename: pdfFileName,
                    path: pdfFileName
                })
            }

            const mailOptions = {
                from: this.configService.get<string>('SMTP_USER'),
                to,
                subject,
                html: ejsFile,
                attachments
            };

            return await transporter.sendMail(mailOptions);
        } catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}
