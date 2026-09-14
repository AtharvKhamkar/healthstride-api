import { Module } from "@nestjs/common";
import { ClinicService } from "./services/clinic.service";
import { ClinicController } from "./clinic.controller";
import { CommonModule, rabbitmqConfig } from "@app/common";
import { ClinicMailService } from "./services/clinic.mail.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        CommonModule
    ],
    controllers: [ClinicController],
    providers: [ClinicService, ClinicMailService],
})
export class ClinicModule { } 