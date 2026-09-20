import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, GlobalResponseInterceptor, setupSwagger } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('auth');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  setupSwagger({ app: app, title: 'Auth Service', description: 'Auth Service Decription', apiVersion: '1.0', route: 'api' });

  await app.listen(3001);
}
bootstrap();
