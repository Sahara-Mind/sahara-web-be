import { NestFactory } from '@nestjs/core';
import { AppModule } from './App.Module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger documentation
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
