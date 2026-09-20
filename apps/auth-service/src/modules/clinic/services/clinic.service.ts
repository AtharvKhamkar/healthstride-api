import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { CheckClinicOwnerExistsDto } from "../dtos/check-clinic-owner-exists.dto";
import { AppJwtService, FnGetUserProfileDetails, IPgQuery, IUserDb, JwtPayload, OtpPurpose, OtpUtil, PasswordUtil, PostgreSqlService, ResponseUtil, TimeConversionUtil } from "@app/common";
import { FnCheckClinicOwnerExistsResult, FnRegisterClinicOwnerResult, FnRegisterUserSessionResult, FnSetInactiveOtpResult, FnVerifyClinicOwnerResult } from "../types/ clinic.types";
import { CheckClinicOwnerExistsEntity } from "../entities/check-clinic-owner-exists-response.entity";
import { VerifyClinicOwnerDto } from "../dtos/verify-clinic-owner.dto";
import { ClinicOwnerRegisterDto } from "../dtos/clinic-owner-register.dto";
import { ClinicOwnerRegisterResponseEntity } from "../entities/clinic-owner-register-response.entity";
import { ConfigService } from "@nestjs/config";
import { ClinicMailService } from "./clinic.mail.service";
import { VerifyClinicOwnerResponseEntity } from "../entities/verify-clinic-owner-response.entity";
import { ClinicOwnerLoginDto } from "../dtos/clinic-owner-login.dto";
import { ClinicOwnerLoginResponseEntity } from "../entities/clinic-owner-login-response.entity";

@Injectable()
export class ClinicService {
    constructor(private readonly postgreSqlService: PostgreSqlService,
        private readonly configService: ConfigService,
        private readonly clinicMailService: ClinicMailService,
        private readonly jwtService: AppJwtService
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

    //Clinic Owner Login
    async clinicOwnerLogin(dto: ClinicOwnerLoginDto, ctx: { ip: string; userAgent?: string }) {
        // fetch user details
        const pgQuery: IPgQuery = {
            query: 'SELECT * FROM auth.fn_get_profile_details($1, $2)',
            params: [
                null,
                dto.email
            ]
        };

        const queryResult = await this.postgreSqlService.queryOne<FnGetUserProfileDetails<IUserDb>>(pgQuery);

        if (!queryResult?.success || !queryResult.data) {
            throw new BadRequestException(queryResult?.message);
        };

        const user = queryResult.data;

        if (user.is_deleted) throw new UnauthorizedException('User not found');
        if (!user.is_verified) throw new ForbiddenException('User is not verified');

        //validate password
        const papper = this.configService.get<string>('PASSWORD_PEPPER') ?? '';
        const isPasswordValid = await PasswordUtil.verify(user.password, dto.password, papper);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        //Generate tokens
        const payload: JwtPayload = {
            sub: user.user_id,
            email: user.email,
            firstName: user.first_name,
            middleName: user.middle_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            role: user.role
        }

        const { accessToken, refreshToken } = await this.jwtService.generateTokens(payload);

        //hash refresh token
        const refreshTokenHash = await PasswordUtil.hash(refreshToken, papper);

        //set session expiry
        const refreshExpiryDays = Number(this.configService.get<String>('JWT_REFRESH_EXPIRES_IN') ?? '7');
        const expiresAt = new Date(Date.now() + refreshExpiryDays * 24 * 60 * 60 * 1000);



        //set user session to the db
        const registerUserSessionQuery: IPgQuery = {
            query: 'SELECT * FROM auth.fn_register_user_session($1, $2, $3, $4, $5, $6)',
            params: [
                user.user_id,
                refreshTokenHash,
                dto.deviceInfo ?? ctx.userAgent ?? null,
                ctx.ip,
                dto.platform,
                expiresAt
            ]
        }

        const registerUserSessionQueryResult = await this.postgreSqlService.queryOne<FnRegisterUserSessionResult>(registerUserSessionQuery);

        if (!registerUserSessionQueryResult?.success || !registerUserSessionQueryResult?.data) {
            throw new BadRequestException(registerUserSessionQueryResult?.message);
        }

        //success response
        return ResponseUtil.success(
            'User logged in successfully',
            new ClinicOwnerLoginResponseEntity({
                userId: user.user_id,
                email: user.email,
                firstName: user.first_name,
                middleName: user.middle_name ?? '',
                lastName: user.last_name,
                clinicName: user.clinic_name ?? '',
                role: user.role,
                profileImage: user.profile_image,
                countryCode: user.country_code,
                phoneNumber: user.phone_number,
                gender: user.gender,
                isVerified: user.is_verified,
                isDisabled: user.is_disabled,
                isDeleted: user.is_deleted,
                accessToken: accessToken,
                refreshToken: refreshToken,
            })
        )
    }
}