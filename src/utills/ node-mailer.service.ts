
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendResetPasswordEmail(email: string, resetLink: string) {
        await this.transporter.sendMail({
            from: this.configService.get('SMTP_USER'),
            to: email,
            subject: 'Reset Your Password',
            html: `Click <a href="${resetLink}">here</a> to reset your password.`,
        });
    }
}
