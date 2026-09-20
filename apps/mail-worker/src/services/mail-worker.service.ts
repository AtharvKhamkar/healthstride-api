import { Injectable, Logger } from '@nestjs/common';
import { TemplatesRendererOptions } from '../types/mail.types';
import { IEmailVerifyEmailEventPayload } from '@app/common';
import { SMTPService } from './smtp.service';
import { TemplateRendererService } from './template-renderer.service';

@Injectable()
export class MailWorkerService {
  private readonly logger = new Logger(MailWorkerService.name);

  constructor(
    private readonly smtpService: SMTPService,
    private readonly renderer: TemplateRendererService
  ) { }

  async sendEmailVerificationEmail(emailPayload: IEmailVerifyEmailEventPayload) {
    const contentOptions: TemplatesRendererOptions = {
      templateName: 'emailverify.html',
      variables: {
        email: emailPayload.email,
        name: emailPayload.name,
        otp: emailPayload.otp,
        expiresAt: emailPayload.expiresAt
      }
    }
    const html = await this.renderer.render(contentOptions);

    await this.smtpService.send({
      to: emailPayload.email,
      subject: 'Email Verification',
      html: html
    })

    this.logger.log(`Email Verification email send to ${emailPayload.email}`)
  }
}
