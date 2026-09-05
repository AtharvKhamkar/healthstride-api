import { TopicExchange } from "@app/common";
import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices";

export const createRabbitmqClient = (
    config: ConfigService,
    queue: string
): RmqOptions => {
    const rabbitMQUrl = config.get('rabbitmq');

    if (!rabbitMQUrl?.url) {
        throw new Error('RabbitMQ config is missing');
    }

    return {
        transport: Transport.RMQ,
        options: {
            urls: [rabbitMQUrl.url],
            queue: queue,
            exchange: TopicExchange,
            queueOptions: {
                durable: true,
            },
            socketOptions: {
                heartbeatIntervalInSeconds: 30,
                reconnectTimeInSeconds: 5,
            },
        },
    }


}