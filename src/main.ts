import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { portSchema } from './joi-schemas'; 
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const configService = app.get<ConfigService>(ConfigService);

  // Validate the PORT value using Joi
  const { error, value: port } = portSchema.validate(configService.get<number>('PORT'));
  if (error) {
    throw new Error(`Invalid PORT configuration: ${error.message}`);
  }

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
