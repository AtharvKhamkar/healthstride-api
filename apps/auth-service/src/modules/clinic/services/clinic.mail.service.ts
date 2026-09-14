import { IEmailVerifyEmailEventPayload, IForgotPasswordEmailEventPayload, IWelcomeEmailEventPayload, MailQueueEvents, QueueName } from "@app/common";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ClinicMailService {
    private readonly logger = new Logger(ClinicMailService.name);
    constructor(
        @Inject(QueueName)
        private readonly client: ClientProxy
    ) { }

    //Send Welcome Mail
    async sendWelcomeEmail(payload: IWelcomeEmailEventPayload) {
        await this.client.connect();

        this.client.emit(MailQueueEvents.SEND_WELCOME, payload);
        this.logger.log(`Event :: Event ${MailQueueEvents.SEND_WELCOME} send`);
    }

    //forgot Password Mail
    async forgotPasswordEmail(payload: IForgotPasswordEmailEventPayload) {
        await this.client.connect();

        this.client.emit(MailQueueEvents.FORGOT_PASSWORD, payload);
        this.logger.log(`Event :: Event ${MailQueueEvents.FORGOT_PASSWORD} send`)
    }

    //forgot Password Mail
    async verifyEmailAddressEmail(payload: IEmailVerifyEmailEventPayload) {
        await this.client.connect();

        this.client.emit(MailQueueEvents.EMAIL_VERIFY, payload);
        this.logger.log(`Event :: Event ${MailQueueEvents.EMAIL_VERIFY} send`)
    }
}