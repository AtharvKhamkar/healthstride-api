import { Module } from "@nestjs/common";
import { ClinicService } from "./clinic.service";
import { ClinicController } from "./clinic.controller";

@Module({
    imports:[],
    controllers:[ClinicController],
    providers:[ClinicService]
})
export class ClinicModule{}