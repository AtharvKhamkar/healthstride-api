import { registerAs } from "@nestjs/config";
import { ConfigType } from "../constants/constants";


export const rabbitmqConfig = registerAs(ConfigType.RABBITMQ, () => {
    const url = process.env.RABBITMQ_URL;

    if (!url) throw new Error('RABBIT_MQ URL is missing.');

    return {
        url,
        heartbeat: 30,
        reconnectTime: 5,
    }
})