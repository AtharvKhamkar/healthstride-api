import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CheckClinicOwnerExistsDto } from "../dtos/check-clinic-owner-exists.dto";
import { IPgQuery, OtpPurpose, OtpUtil, PasswordUtil, PostgreSqlService, ResponseUtil, TimeConversionUtil } from "@app/common";
import { FnCheckClinicOwnerExistsResult, FnRegisterClinicOwnerResult, FnSetInactiveOtpResult, FnVerifyClinicOwnerResult } from "../types/ clinic.types";
import { CheckClinicOwnerExistsEntity } from "../entities/check-clinic-owner-exists-response.entity";
import { VerifyClinicOwnerDto } from "../dtos/verify-clinic-owner.dto";
import { ClinicOwnerRegisterDto } from "../dtos/clinic-owner-register.dto";
import { ClinicOwnerRegisterResponseEntity } from "../entities/clinic-owner-register-response.entity";
import { ConfigService } from "@nestjs/config";
import { ClinicMailService } from "./clinic.mail.service";
import { VerifyClinicOwnerResponseEntity } from "../entities/verify-clinic-owner-response.entity";

@Injectable()
export class ClinicService {
    constructor(private readonly postgreSqlService: PostgreSqlService,
        private readonly configService: ConfigService,
        private readonly clinicMailService: ClinicMailService
    ) { }

    async checkClinicOwnerExists(dto: CheckClinicOwnerExistsDto) {
        const pgQuery: IPgQuery = {
            query: `SELECT * FROM auth.fn_check_clinic_owner_exists($1)`,
            params: [
                dto.email
            ]
        }

        const queryData = await this.postgreSqlService.queryOne<FnCheckClinicOwnerExistsResult>(pgQuery);

        if (!queryData?.success) {
            throw new BadRequestException(
                queryData?.message
            )
        }

        return ResponseUtil.success(
            'Clinic owner checked successfully',
            new CheckClinicOwnerExistsEntity({
                isExists: queryData?.data?.isExists,
                isVerified: queryData?.data?.isVerified,
            })
        );
    }

    async registerClinicOwer(dto: ClinicOwnerRegisterDto) {
        const passwordPepper = this.configService.get<string>('PASSWORD_PEPPER') ?? '';
        const otpPapper = this.configService.get<string>('OTP_PEPPER') ?? '';

        const hashedPassword = await PasswordUtil.hash(dto.password, passwordPepper);

        // 2. Create random six digit otp
        const otp = OtpUtil.generate();
        const hashedOtp = await OtpUtil.hash(otp, otpPapper);

        //3. email verification otp expires in
        const otpExpiresIn = this.configService.get<string>('EMAIL_VERIFY_EXPIRES_IN') ?? '';

        const pgQuery: IPgQuery = {
            query: `SELECT * FROM auth.fn_clinic_owner_register($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            params: [
                dto.firstName,
                dto.middleName,
                dto.lastName,
                dto.email,
                dto.countryCodeId,
                dto.phoneNumber,
                hashedPassword,
                dto.roleId,
                dto.profile_photo_key,
                dto.birth_date,
                dto.gender,
                hashedOtp,
                otpExpiresIn
            ]
        }

        const queryData = await this.postgreSqlService.queryOne<FnRegisterClinicOwnerResult>(pgQuery);

        if (!queryData?.success) {
            throw new BadRequestException(
                queryData?.message
            )
        }

        const formattedExpiryTime = TimeConversionUtil.formatTime(queryData.data?.expiresAt ?? '');

        this.clinicMailService.verifyEmailAddressEmail({ email: dto.email, name: `${dto.firstName} ${dto.lastName}`, otp: otp, expiresAt: formattedExpiryTime })


        return ResponseUtil.success(
            'Clinic owner registered successfully',
            new ClinicOwnerRegisterResponseEntity({
                isRegistered: queryData?.data?.isRegistered,
                userId: queryData?.data?.userId,
                expiresAt: queryData?.data?.expiresAt

            })
        );
    }

    async verifyClinicOwner(dto: VerifyClinicOwnerDto) {
        //Env variables
        const pepper = this.configService.get<string>('OTP_PEPPER') ?? '';

        //Get active otp
        const pgQuery: IPgQuery = {
            query: `SELECT * FROM auth.fn_get_active_otp($1, $2, $3)`,
            params: [
                OtpPurpose.emailVerification,
                null,
                dto.email
            ]
        }

        const queryData = await this.postgreSqlService.queryOne<FnVerifyClinicOwnerResult>(pgQuery);

        if (!queryData?.success || !queryData.data) {
            throw new BadRequestException(queryData?.message);
        }

        //Check verified or not
        const isVerified = await OtpUtil.verify(dto.otp, queryData.data.otpHash, pepper);

        if (!isVerified) {
            throw new BadRequestException('Invalid OTP');
        }

        //Mark otp as inactive after successfully verified
        const pgSetInactiveOtpQuery: IPgQuery = {
            query: 'SELECT * FROM auth.fn_set_inactive_otp($1)',
            params: [
                queryData.data.otpId
            ]
        };

        const setInactiveOtpQueryResult = await this.postgreSqlService.queryOne<FnSetInactiveOtpResult>(pgSetInactiveOtpQuery);

        if (!setInactiveOtpQueryResult?.success) {
            throw new BadRequestException(setInactiveOtpQueryResult?.message);
        };

        return ResponseUtil.success(
            'Profile Verified Successfully',
            new VerifyClinicOwnerResponseEntity({
                isVerified: true
            })
        );
    }
}