import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {MongoDbModule} from '@app/common';
import {HealthSyncModule} from './modules/health-sync/health-sync.module';
import { HealthCheckController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongoDbModule,

    HealthSyncModule,
  ],
  controllers:[HealthCheckController]
})
export class AppModule {}