import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/users/user.module';
import { CourseModule } from './api/course/course.module';
import { LessonModule } from './api/lesson/lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/learning_management_system'),
    AuthModule,
    UserModule,
    CourseModule,
    LessonModule
  ]
})

export class AppModule { }
