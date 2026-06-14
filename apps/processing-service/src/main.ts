import { NestFactory } from '@nestjs/core';
import { ProcessingServiceModule } from './processing-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProcessingServiceModule);
  await app.listen(3003);
}
bootstrap();
