import {
  IsArray,
  IsObject,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';

import { Type } from 'class-transformer';

class HealthRecordDto {

  @IsString()
  dataType?: string;

  @IsObject()
  payload?: Record<string, any>;
}

export class CreateHealthSyncDto {

  @IsString()
  source?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HealthRecordDto)
  records?: HealthRecordDto[];
}