import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schema/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { MESSAGE, NOTIFICATION, NOTIFICATION_TITLE } from "../../constants/constants";
import { EmailService } from "../../utills/email.service";
import { StripeService } from "../stripe/ stripe.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseDto } from "../../common/dto/response.dto";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ErrorHandlerService } from "../../utills/error-handler.service";
import { NotificationService } from "../../utills/notification.service";
import { NotificationType } from "../notification/enum/notification.enum";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly nodeMailerService: EmailService,
        private readonly stripeService: StripeService,
        private readonly configService: ConfigService,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly notificationService: NotificationService
    ) { }

    async signup(createUserDto: CreateUserDto): Promise<ResponseDto> {
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email });

            if (existingUser) {
                return { statusCode: HttpStatus.FORBIDDEN, message: MESSAGE.USER_ALREADY_EXITS };
            }

            const customer = await this.stripeService.createCustomer(createUserDto.email);
            const createdUser = new this.userModel({ ...createUserDto, stripeCustomerId: customer.id });
            createdUser.save();
            return { statusCode: HttpStatus.CREATED, message: MESSAGE.USER_CREATED, data: createdUser };
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async signIn(loginDto: LoginDto): Promise<ResponseDto> {
        try {
            const user = await this.userModel.findOne({ email: loginDto.email });

            if (!user) {
                return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.INVALID_CREDENTIALS };
            }

            const match = await bcrypt.compare(loginDto.password, user.password);
            if (!match) {
                return { statusCode: HttpStatus.FORBIDDEN, message: MESSAGE.INVALID_CREDENTIALS };
            }
            const token = await this.jwtService.sign({ id: user.id, email: user.email, role: user.role, username: user.first_name });
            return { statusCode: HttpStatus.OK, message: MESSAGE.LOGIN_SUCCESSFUL, data: { token: token, userData: user } };

        } catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ResponseDto> {

        try {

            const user = await this.userModel.findOne({ email: forgotPasswordDto.email });

            if (!user) {
                return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.INVALID_CREDENTIALS };
            }

            const resetToken = await this.jwtService.sign({ id: user.id, email: user.email, role: user.role, username: user.first_name });
            const resetLink = `http://localhost:3001/reset-password/${resetToken}`;

            const email = await this.nodeMailerService.sendEmail(forgotPasswordDto.email, MESSAGE.EMAIL_SUBJECT, `${MESSAGE.EMAIL_MESSAGE}: ${resetLink}`);
            if (!email) {
                return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.EMAIL_SENDING_FAILED };
            }
            const data = await this.userModel.findOneAndUpdate(
                { email: forgotPasswordDto.email },
                {
                    resetToken: resetToken,
                    resetTokenExpiration: new Date(Date.now() + Number(this.configService.get('TOKEN_EXPIRY')))
                }
            );

            return { statusCode: HttpStatus.OK, message: MESSAGE.RESET_PASSWORD_EMAIL_SENT };
        }
        catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto, resetToken: string): Promise<ResponseDto> {
        try {
            const decodedToken = this.jwtService.decode(resetToken);
            if (!decodedToken) {
                return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.INVALID_TOKEN };
            }

            const user = await this.userModel.findOne({
                email: decodedToken.email,
                resetToken,
                resetTokenExpiration: { $gt: new Date() },
            });

            if (!user) {
                return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.INVALID_TOKEN };
            }

            user.password = resetPasswordDto.newPassword;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            await user.save();

            const data = this.notificationService.sendNotification(NOTIFICATION_TITLE.PASSWORD_RESET, NOTIFICATION.PASSWORD_RESET_CONTENT, NotificationType.INFO);

            return { statusCode: HttpStatus.OK, message: MESSAGE.PASSWORD_RESET };

        } catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}
