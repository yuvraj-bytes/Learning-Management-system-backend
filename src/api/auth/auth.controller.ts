import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "./auth.service";
import { User } from "../users/schema/user.schema";
import { LoginOutputDto } from "./dto/login-output.dto";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async create(@Body() createUserDto: CreateUserDto): Promise<User | String | { message: string, statusCode: number, data?: User }> {
        return await this.authService.signup(createUserDto);
    }

    @Post('signin')
    async signIn(@Body('email') email: string, @Body('password') password: string): Promise<User | LoginOutputDto> {
        return this.authService.signIn(email, password);
    }
}
