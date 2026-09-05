import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CheckClinicOwnerExistsDto } from "./dtos/check-clinic-owner-exists.dto";
import { IPgQuery, PostgreSqlService, ResponseUtil } from "@app/common";
import { FnCheckClinicOwnerExistsResult } from "./types/ clinic.types";
import { CheckClinicOwnerExistsEntity } from "./entities/check-clinic-owner-exists-response.entity";

@Injectable()
export class ClinicService {
    constructor(private readonly postgreSqlService: PostgreSqlService) { }

    async checkClinicOwnerExists(checkClinicOwnerExistsDto: CheckClinicOwnerExistsDto) {
        const pgQuery: IPgQuery = {
            query: `SELECT * FROM auth.fn_check_clinic_owner_exists($1)`,
            params: [
                checkClinicOwnerExistsDto.email
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
}