import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { NodeMailerService } from './ node-mailer.service';
import { StripeService } from './ stripe.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        //PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: 'secretKey',
            signOptions: { expiresIn: '6h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthController, AuthService, JwtStrategy, NodeMailerService, StripeService],
    exports: [AuthService],
})

export class AuthModule { }
