import { QueueName } from '@app/common/constants/constants';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createRabbitmqClient } from './rabbitmq.factory';

@Global()
@Module({
  imports:[
    ClientsModule.registerAsync([
      {
        name: QueueName,
        imports:[ConfigModule],
        inject: [ConfigService],
        useFactory : (config: ConfigService) => createRabbitmqClient(config, QueueName)
      }
    ])
  ],
  providers: [],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
