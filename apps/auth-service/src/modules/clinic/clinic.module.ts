import { Module } from "@nestjs/common";
import { ClinicService } from "./clinic.service";
import { ClinicController } from "./clinic.controller";
import { CommonModule } from "@app/common";

@Module({
    imports:[
        CommonModule
    ],
    controllers:[ClinicController],
    providers:[ClinicService],
})
export class ClinicModule{} 