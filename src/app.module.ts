import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/users/user.module';
import { CourseModule } from './api/course/course.module';
import { LessonModule } from './api/lesson/lesson.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
    MongooseModule.forRoot('mongodb://localhost/learning_management_system'),
    AuthModule,
    UserModule,
    CourseModule,
    LessonModule
  ],
  //   providers: [
  //     {
  //       provide: APP_INTERCEPTOR,
  //       useClass: ThrottlerGuard,
  //     },
  //  ]
})


export class AppModule { }
