import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "./auth.service";
import { User } from "../users/schema/user.schema";
import { LoginOutputDto } from "./dto/login-output.dto";
import { SignupOutputDto } from "./dto/signup-output";
import { StripeService } from "./ stripe.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,
        private stripeService: StripeService
    ) { }

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
        return this.authService.forgotPassword(email);
    }

    @Patch('reset-password/:token')
    async resetPassword(@Body('email') email: string, @Body('newPassword') newPassword: string, @Param('token') resetToken: string) {
        return this.authService.resetPassword(email, newPassword, resetToken);
    }

    @Get('/checkout-session/:priceId')
    async checkout(@Param('priceId') priceId: string) {
        return this.stripeService.createcheckoutSession(priceId);
    }
}
