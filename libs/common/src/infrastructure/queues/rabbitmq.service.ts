import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMQService
  implements OnModuleInit, OnModuleDestroy {

  private connection!: ChannelModel;
  private channel!: Channel;

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const rabbitMQUrl =
      this.configService.get<string>('RABBITMQ_URL');

    if (!rabbitMQUrl) {
      throw new Error('RABBITMQ_URL not found');
    }

    this.connection = await amqp.connect(rabbitMQUrl);

    this.channel = await this.connection.createChannel();
  }

  getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    return this.channel;
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
