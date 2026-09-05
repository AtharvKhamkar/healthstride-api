import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { ClinicService } from "./clinic.service";
import { CheckClinicOwnerExistsDto } from "./dtos/check-clinic-owner-exists.dto";
import { VerifyClinicOwnerDto } from "./dtos/verify-clinic-owner.dto";
import { ClinicOwnerRegisterDto } from "./dtos/clinic-owner-register.dto";

@Controller('/clinic')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) { }

    @Post('/check-clinic-owner-exists')
    @ApiBody({ type: CheckClinicOwnerExistsDto })
    async checkClinicOwnerExists(@Body() dto: CheckClinicOwnerExistsDto) {        
        return this.clinicService.checkClinicOwnerExists(dto);
    }

    @Post('/verify-clinic-owner')
    @ApiBody({type: VerifyClinicOwnerDto})
    async verifyClinicOwner(@Body() dto: VerifyClinicOwnerDto){
    }

    @Post('/register-clinic-owner')
    @ApiBody({type: ClinicOwnerRegisterDto})
    async registerClinicOwner(@Body() dto: ClinicOwnerRegisterDto){
        return this.clinicService.registerClinicOwer(dto);
    }
}