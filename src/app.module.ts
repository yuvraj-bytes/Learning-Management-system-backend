import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/users/user.module';
import { CourseModule } from './api/course/course.module';
import { LessonModule } from './api/lesson/lesson.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 1,
    }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService], // Add this line to inject the ConfigService
    }),
    AuthModule,
    UserModule,
    CourseModule,
    LessonModule,
  ],
  //   providers: [
  //     {
  //       provide: APP_INTERCEPTOR,
  //       useClass: ThrottlerGuard,
  //     },
  //  ]
})
export class AppModule { }
