import { Module } from '@nestjs/common';

import { MongooseModule }
from '@nestjs/mongoose';

import {
  HealthRawEvent,
  HealthRawEventSchema,
} from './schema/health-raw-event.schema';

import { HealthSyncController } from './controller/health-sync.controller';

import { HealthSyncService } from './service/health-sync.service';

import { HealthRawEventRepository } from './repository/health-raw-event.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name:
          HealthRawEvent.name,
        schema:
          HealthRawEventSchema,
      },
    ]),
  ],
  controllers: [
    HealthSyncController,
  ],
  providers: [
    HealthSyncService,
    HealthRawEventRepository,
  ],
})
export class HealthSyncModule {}