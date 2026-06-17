import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   setupSwagger({ app: app, title: 'Sync Service', description: 'Sync Service Decription', apiVersion: '1.0', route: 'api' });

  await app.listen(3010);

 
}
bootstrap();
