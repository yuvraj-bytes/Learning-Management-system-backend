import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "./auth.service";
import { User } from "../users/schema/user.schema";

import { ResponseDto } from "src/common/dto/response.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService
    ) { }

    @Post('signup')
    async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
        return await this.authService.signup(createUserDto);
    }

    @Post('signin')
    async signIn(@Body() loginDto: LoginDto): Promise<ResponseDto> {
        return await this.authService.signIn(loginDto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ResponseDto> {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }

    @Patch('reset-password/:token')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Param('token') resetToken: string): Promise<ResponseDto> {
        return await this.authService.resetPassword(resetPasswordDto, resetToken);
    }
}
