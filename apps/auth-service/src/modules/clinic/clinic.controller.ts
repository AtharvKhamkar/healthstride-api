import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { ClinicService } from "./clinic.service";
import { CheckClinicOwnerExistsDto } from "./dtos/check-clinic-owner-exists.dto";

@Controller('/clinic')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) { }

    @Post('/check-clinic-owner-exists')
    @ApiBody({ type: CheckClinicOwnerExistsDto })
    async checkClinicOwnerExists(@Body() dto: CheckClinicOwnerExistsDto) {        
        return this.clinicService.checkClinicOwnerExists(dto);
    }
}