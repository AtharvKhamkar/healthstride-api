import { Injectable } from '@nestjs/common';

import { CreateHealthSyncDto } from '../dto/create-health-sync.dto';

import { HealthRawEventRepository }
  from '../repository/health-raw-event.repository';

@Injectable()
export class HealthSyncService {

  constructor(
    private readonly repository:
      HealthRawEventRepository,
  ) { }

  async syncHealthData(
    userId: string,
    dto: CreateHealthSyncDto,
  ) {

    const records =
      dto.records?.map((record) => ({
        userId,
        source: dto.source,
        dataType: record.dataType,
        receivedAt: new Date(),
        payload: record.payload,
      }));

    await this.repository.createMany(
      records,
    );

    return {
      success: true,
      data: {
        processedRecords: records?.length
      }
      ,
    };
  }
}