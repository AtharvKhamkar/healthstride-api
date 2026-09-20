import { registerAs } from "@nestjs/config";
import { ConfigType } from "../constants/constants";


export const rabbitmqConfig = registerAs(ConfigType.RABBITMQ, () => {
    const url = process.env.RABBIT_MQ_URL;

    if (!url) throw new Error('RABBIT_MQ_URL URL is missing.');

    return {
        url,
        heartbeat: 30,
        reconnectTime: 5,
    }
})