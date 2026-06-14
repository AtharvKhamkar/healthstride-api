import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  HealthRawEvent,
  HealthRawEventDocument,
} from '../schema/health-raw-event.schema';

import { Model } from 'mongoose';

@Injectable()
export class HealthRawEventRepository {

  constructor(
    @InjectModel(
      HealthRawEvent.name,
    )
    private readonly model:
      Model<HealthRawEventDocument>,
  ) {}

  async createMany(
    data: Partial<HealthRawEvent>[] | undefined,
  ) {
    return this.model.insertMany(data);
  }
}