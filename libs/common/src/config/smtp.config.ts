import { registerAs } from "@nestjs/config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ConfigType } from "../constants/constants";

export const mailConfig = registerAs(ConfigType.SMTP, (): SMTPTransport.Options & { sender: string } => ({

    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',

    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD
    },

    tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
    },

    sender: process.env.SMTP_SENDER!
}))