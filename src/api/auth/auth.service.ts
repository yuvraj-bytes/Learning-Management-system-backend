import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schema/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { MESSAGE } from "src/constants/constants";
import { NodeMailerService } from "../../utills/ node-mailer.service";
import { randomBytes } from 'crypto';
import { StripeService } from "../stripe/ stripe.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseDto } from "src/common/dto/response.dto";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly nodeMailerService: NodeMailerService,
        private readonly stripeService: StripeService,
        private readonly configService: ConfigService,
    ) { }

    async signup(createUserDto: CreateUserDto): Promise<ResponseDto> {
        try {

            const existingUser = await this.userModel.findOne({ email: createUserDto.email });

            if (existingUser) {
                return { statusCode: HttpStatus.FORBIDDEN, message: MESSAGE.USER_ALREADY_EXITS, data: existingUser };
            }

            const customer = await this.stripeService.createCustomer(createUserDto.email);
            const createdUser = new this.userModel({ ...createUserDto, email: createUserDto.email, password: createUserDto.password, stripeCustomerId: customer.id });
            createdUser.save();
            return { statusCode: HttpStatus.CREATED, message: MESSAGE.USER_CREATED, data: createdUser };
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async signIn(loginDto: LoginDto): Promise<ResponseDto> {
        try {
            const user = await this.userModel.findOne({ email: loginDto.email });

            if (!user) {
                return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.INVALID_CREDENTIALS, data: {} };
            } else {
                const match = await bcrypt.compare(loginDto.password, user.password);
                if (match) {
                    const token = await this.jwtService.signAsync({ id: user.id, email: user.email, role: user.role, username: user.first_name });
                    return { statusCode: HttpStatus.OK, message: MESSAGE.LOGIN_SUCCESSFUL, data: { token: token, userData: user } };
                } else {
                    return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.INVALID_CREDENTIALS, data: {} };
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ResponseDto> {
        try {

            if (!forgotPasswordDto.email) {
                return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.FIELDS_REQUIRED, data: {} };
            }

            const resetToken = randomBytes(20).toString('hex');
            const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;

            await this.userModel.findOneAndUpdate(
                { forgotPasswordDto: forgotPasswordDto.email },
                { resetToken, resetTokenExpiration: new Date(Date.now() + this.configService.get('TOKEN_EXPIRY')), resetLink },
                { new: true }
            );

            await this.nodeMailerService.sendResetPasswordEmail(forgotPasswordDto.email, resetLink);
            return { statusCode: HttpStatus.OK, message: MESSAGE.RESET_PASSWORD_EMAIL_SENT, data: {} };
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto, resetToken: string): Promise<ResponseDto> {

        try {

            const user = await this.userModel.findOne({
                resetToken,
                resetTokenExpiration: { $gt: new Date() },
            });

            if (!user) {
                return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.INVALID_TOKEN, data: {} };
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, saltRounds);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            await user.save();

            return { statusCode: HttpStatus.OK, message: MESSAGE.PASSWORD_RESET };
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
