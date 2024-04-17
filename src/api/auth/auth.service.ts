import { HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schema/user.schema";
import * as bcrypt from 'bcrypt';
import { LoginOutputDto } from "./dto/login-output.dto";
import { JwtService } from "@nestjs/jwt";
import { FIELDS_REQUIRED, INVALID_CREDENTIALS, LOGIN_SUCCESSFUL, USER_ALREADY_EXITS, USER_NOT_FOUND } from "src/constants/constants";
import { SignupOutputDto } from "./dto/signup-output";
import * as nodemailer from 'nodemailer';
import { NodeMailerService } from "./ node-mailer.service";
import { randomBytes } from 'crypto';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly nodeMailerService: NodeMailerService) { }

    async signup(createUserDto: UserDto): Promise<User | SignupOutputDto> {

        const { email, password, ...rest } = createUserDto;
        if (!createUserDto.first_name || !createUserDto.email || !createUserDto.password) {
            return { status: HttpStatus.BAD_REQUEST, message: FIELDS_REQUIRED };
        }

        const existingUser = await this.userModel.findOne({ email });

        if (existingUser) {
            return { status: HttpStatus.FORBIDDEN, message: USER_ALREADY_EXITS };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdUser = new this.userModel({ ...rest, email, password: hashedPassword });
        return createdUser.save();
    }

    async signIn(email: string, password: string): Promise<LoginOutputDto> {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = await this.jwtService.signAsync({ id: user.id, email: user.email, role: user.role, username: user.first_name });
                return { status: HttpStatus.OK, message: LOGIN_SUCCESSFUL, token, data: user };
            } else {
                return { status: HttpStatus.BAD_REQUEST, message: INVALID_CREDENTIALS };
            }
        }
    }

    async forgotPassword(email: string) {
        const resetToken = randomBytes(20).toString('hex');
        const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;

        const user = await this.userModel.findOneAndUpdate(
            { email },
            { resetToken, resetTokenExpiration: new Date(Date.now() + 3600000), resetLink },
            { new: true }
        );
        await this.nodeMailerService.sendResetPasswordEmail(email, resetLink);
        return { message: 'Reset password email sent' };
    }

    async resetPassword(email: string, newPassword: string, resetToken: string) {
        const user = await this.userModel.findOne({
            email,
            resetToken,
            resetTokenExpiration: { $gt: new Date() },
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        return { message: 'Password reset successful' };
    }
}
