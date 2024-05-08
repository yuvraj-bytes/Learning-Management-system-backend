import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { StripeService } from '../stripe/ stripe.service';
import { StripeModule } from '../stripe/stripe.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from 'src/utills/error-handler.service';
import { EmailService } from 'src/utills/email.service';
import { NotificationModule } from '../notification/notification.module';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        //PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
            }),
            inject: [ConfigService]
        }),
        StripeModule,
        NotificationModule
    ],
    controllers: [AuthController],
    providers: [AuthController, AuthService, JwtStrategy, EmailService, StripeService, ErrorHandlerService],
    exports: [AuthService],
})

export class AuthModule { }
