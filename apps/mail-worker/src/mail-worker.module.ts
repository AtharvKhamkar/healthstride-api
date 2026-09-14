import { Module } from '@nestjs/common';
import { MailWorkerController } from './mail-worker.controller';
import { MailWorkerService } from './services/mail-worker.service';
import { ConfigModule } from '@nestjs/config';
import { mailConfig } from '@app/common';
import { TemplateRendererService } from './services/template-renderer.service';
import { SMTPService } from './services/smtp.service';

@Module({
  imports: [
    //Config modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig]
    }),
  ],
  controllers: [MailWorkerController],
  providers: [MailWorkerService, TemplateRendererService, SMTPService],
})
export class MailWorkerModule {}
