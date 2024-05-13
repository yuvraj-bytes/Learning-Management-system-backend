import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { StripeService } from './ stripe.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/guard/getUser.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('/webhook')
    handleWebhook(@Body() payload: any): any {
        this.stripeService.processWebhookEvent(payload);
        return { received: true };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('/checkout-session/:priceId')
    async checkout(@Param('priceId') priceId: string, @GetUser() userdata: any) {
        return this.stripeService.createcheckoutSession(priceId, userdata);
    }
}
