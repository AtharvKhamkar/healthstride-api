import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { CreateHealthSyncDto }
from '../dto/create-health-sync.dto';

import { HealthSyncService }
from '../service/health-sync.service';
import { get } from 'http';

@Controller('health')
export class HealthSyncController {

  constructor(
    private readonly healthSyncService:
      HealthSyncService,
  ) {}

  @Post('sync')
  async sync(
    @Body()
    dto: CreateHealthSyncDto,
  ) {

    const userId =
      'user-123';

    return this.healthSyncService
      .syncHealthData(
        userId,
        dto,
      );
  }
}