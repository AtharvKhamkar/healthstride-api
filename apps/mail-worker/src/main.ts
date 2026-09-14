import { NestFactory } from '@nestjs/core';
import { MailWorkerModule } from './mail-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(MailWorkerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
