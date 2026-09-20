import { Controller, Get, Logger } from '@nestjs/common';
import { MailWorkerService } from './services/mail-worker.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import * as mailTypes from '@app/common'

@Controller()
export class MailWorkerController {
  private readonly logger = new Logger(MailWorkerController.name);
  constructor(private readonly mailWorkerService: MailWorkerService) {}

  @EventPattern(mailTypes.MailQueueEvents.EMAIL_VERIFY)
  async handleEmailVerifyMail(
    @Payload() data: mailTypes.IEmailVerifyEmailEventPayload,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.mailWorkerService.sendEmailVerificationEmail(data)
      channel.ack(message);
    } catch (error) {
      this.logger.error(`ERROR :: MailController.handleEmailVerifyMail :: ${error}`);
      channel.nack(message, false, true);
    }

  }
}
