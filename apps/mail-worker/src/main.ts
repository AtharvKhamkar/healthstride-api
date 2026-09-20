import { NestFactory } from '@nestjs/core';
import { MailWorkerModule } from './mail-worker.module';
import { Transport } from '@nestjs/microservices';
import { QueueName } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MailWorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL],
      queue: QueueName,
      noAck: false,
      queueOptions: { 
        durable: true,
      },
    },
  });

  await app.listen();
}
bootstrap();
