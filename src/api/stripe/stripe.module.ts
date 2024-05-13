import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { StripeService } from '../stripe/ stripe.service';
import { StripeController } from './stripe.controller';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [StripeController],
    providers: [StripeController, JwtStrategy, StripeService],
    exports: [StripeService],
})

export class StripeModule { }
