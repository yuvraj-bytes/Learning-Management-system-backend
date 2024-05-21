import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/users/user.module';
import { CourseModule } from './api/course/course.module';
import { LessonModule } from './api/lesson/lesson.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ReviewRatingModule } from './api/reviewRating/review_rating.module';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV === 'dev' ? `${ENV}.env` : '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 1,
    }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CourseModule,
    LessonModule,
    ReviewRatingModule
  ],
  //   providers: [
  //     {
  //       provide: APP_INTERCEPTOR,
  //       useClass: ThrottlerGuard,
  //     },
  //  ]
})
export class AppModule { }
