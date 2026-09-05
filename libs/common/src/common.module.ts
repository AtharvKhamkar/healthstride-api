import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongoDbModule } from './infrastructure/database/mongodb/mongodb.module';
import { PostgreSqlModule } from './infrastructure/database/postgresql/postgresql.module';

@Module({
  imports:[MongoDbModule, PostgreSqlModule],
  providers: [CommonService],
  exports: [CommonService, MongoDbModule, PostgreSqlModule],
})
export class CommonModule {}
