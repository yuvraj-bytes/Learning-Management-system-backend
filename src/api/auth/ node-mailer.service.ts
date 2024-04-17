// node-mailer.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'pallavi.chavda@bytestechnolab.com',
                pass: 'xnha loee ztji fhur ',
            },
        });
    }

    async sendResetPasswordEmail(email: string, resetLink: string) {
        await this.transporter.sendMail({
            from: 'pallavi.chavda@bytestechnolab.com',
            to: email,
            subject: 'Reset Your Password',
            html: `Click <a href="${resetLink}">here</a> to reset your password.`,
        });
    }
}
