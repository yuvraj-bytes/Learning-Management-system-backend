import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { portSchema } from './joi-schemas';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const configService = app.get<ConfigService>(ConfigService);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('LMS APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
