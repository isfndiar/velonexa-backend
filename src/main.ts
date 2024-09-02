import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new BadRequestException({
          property: validationErrors[0].property,
          constraints: validationErrors[0].constraints,
          type: 'classValidator',
        });
      },
    }),
  );
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  try {
    await app.listen(port);
    const appUrl = await app.getUrl();
    console.log(`Application is running on: ${appUrl}`);
    console.log('Jalan bro, hayuk');
  } catch (error) {
    console.error('Error starting application:', error);
  }
}
bootstrap();
