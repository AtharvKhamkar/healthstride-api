import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { ClinicService } from "./services/clinic.service";
import { CheckClinicOwnerExistsDto } from "./dtos/check-clinic-owner-exists.dto";
import { VerifyClinicOwnerDto } from "./dtos/verify-clinic-owner.dto";
import { ClinicOwnerRegisterDto } from "./dtos/clinic-owner-register.dto";
import { CheckClinicOwnerExistsEntity } from "./entities/check-clinic-owner-exists-response.entity";
import { ClinicOwnerRegisterResponseEntity } from "./entities/clinic-owner-register-response.entity";
import { VerifyClinicOwnerResponseEntity } from "./entities/verify-clinic-owner-response.entity";
import { ClinicOwnerLoginDto } from "./dtos/clinic-owner-login.dto";
import { ClinicOwnerLoginResponseEntity } from "./entities/clinic-owner-login-response.entity";
import type { Request } from "express";

@Controller('/clinic')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) { }

    @Post('/check-clinic-owner-exists')
    @ApiBody({ type: CheckClinicOwnerExistsDto })
    @ApiOkResponse({ type: CheckClinicOwnerExistsEntity })
    async checkClinicOwnerExists(@Body() dto: CheckClinicOwnerExistsDto) {
        return this.clinicService.checkClinicOwnerExists(dto);
    }

    @Post('/register-clinic-owner')
    @ApiBody({ type: ClinicOwnerRegisterDto })
    @ApiOkResponse({ type: ClinicOwnerRegisterResponseEntity })
    async registerClinicOwner(@Body() dto: ClinicOwnerRegisterDto) {
        return this.clinicService.registerClinicOwer(dto);
    }

    @Post('/verify-clinic-owner')
    @ApiBody({ type: VerifyClinicOwnerDto })
    @ApiOkResponse({ type: VerifyClinicOwnerResponseEntity })
    async verifyClinicOwner(@Body() dto: VerifyClinicOwnerDto) {
        return this.clinicService.verifyClinicOwner(dto);
    }

    @Post('/login')
    @ApiBody({ type: ClinicOwnerLoginDto })
    @ApiOkResponse({ type: ClinicOwnerLoginResponseEntity })
    async clinicOwnerLogin(@Body() dto: ClinicOwnerLoginDto, @Req() req: Request) {
        const ip = req.ip
            || req.headers['x-forwarded-for']?.toString().split(',')[0].trim()
            || 'unknown';

        const userAgent = req.headers['user-agent'] ?? undefined;

        return this.clinicService.clinicOwnerLogin(dto,{ip, userAgent});
    }
}