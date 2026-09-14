import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongoDbModule } from './infrastructure/database/mongodb/mongodb.module';
import { PostgreSqlModule } from './infrastructure/database/postgresql/postgresql.module';
import { RabbitMQModule } from './infrastructure/queues/rabbitmq.module';

@Module({
  imports:[MongoDbModule, PostgreSqlModule, RabbitMQModule],
  providers: [CommonService],
  exports: [CommonService, MongoDbModule, PostgreSqlModule, RabbitMQModule],
})
export class CommonModule {}
