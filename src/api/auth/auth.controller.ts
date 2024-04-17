import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "./auth.service";
import { User } from "../users/schema/user.schema";
import { LoginOutputDto } from "./dto/login-output.dto";
import { SignupOutputDto } from "./dto/signup-output";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async create(@Body() createUserDto: CreateUserDto): Promise<User | SignupOutputDto> {
        return await this.authService.signup(createUserDto);
    }

    @Post('signin')
    async signIn(@Body('email') email: string, @Body('password') password: string): Promise<User | LoginOutputDto> {
        return this.authService.signIn(email, password);
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        await this.authService.forgotPassword(email);
        return { message: 'Reset password email sent' };
    }

    @Patch('reset-password')
    async resetPassword(@Body('email') email: string, @Body('newPassword') newPassword: string, @Body('resetToken') resetToken: string) {
        await this.authService.resetPassword(email, newPassword, resetToken);
        return { message: 'Password reset successful' };
    }
}
