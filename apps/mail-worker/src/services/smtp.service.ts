import { Inject, Injectable, Logger } from "@nestjs/common";
import { MailWorkerService } from "./mail-worker.service";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { mailConfig } from "@app/common/config/smtp.config";
import * as config from "@nestjs/config";
import { ISendMailOptions } from "../types/mail.types";


@Injectable()
export class SMTPService {
    private readonly logger = new Logger(MailWorkerService.name);
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor(
        @Inject(mailConfig.KEY)
        private readonly mail: config.ConfigType<typeof mailConfig>
    ) {
        this.transporter = nodemailer.createTransport(this.mail);
    }

    async send(options: ISendMailOptions) {
        const info = await this.transporter.sendMail({
            from: this.mail.sender,
            ...options
        });

        this.logger.log(`Mail send to ${options.to}`);

        return info;
    }

}