import { Gender } from "@app/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class ClinicOwnerLoginResponseEntity {
    @ApiProperty({ example: "01a077ce-797a-77ae-949f-7cdf1560407f" })
    @IsUUID()
    userId!: string

    @ApiProperty({ example: 'atharv@gmail.com' })
    email!: string;

    @ApiProperty({ example: 'Atharv' })
    firstName!: string;

    @ApiProperty({ example: 'Gurudas' })
    middleName?: string;

    @ApiProperty({ example: 'Khamkar' })
    lastName!: string | null;

    @ApiProperty({ example: '+91' })
    countryCode!: string;

    @ApiProperty({ example: '9876543210' })
    phoneNumber!: string | null;

    @ApiProperty({ example: 'https://cdn.app.com/cover.png' })
    profileImage?: string | null;

    @ApiProperty({ example: 'MALE' })
    gender!: Gender;

    @ApiProperty({ example: 'Jupiter Universal Hospital' })
    clinicName!: string;

    @ApiProperty({ example: 'STUDENT' })
    role!: string;

    @ApiProperty({ example: true })
    isVerified!: boolean;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4YmNlOS0yNzYwLTQxODktYjk3Yy1hNDlmYTc4NDc0NTMiLCJlbWFpbCI6ImF0aGFydkBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJBdGhhcnYiLCJsYXN0TmFtZSI6IktoYW1rYXIiLCJyb2xlIjoiU1RVREVOVCIsInBob25lTnVtYmVyIjoiKzkxOTg3NjU0MzIxMCIsImlhdCI6MTc2OTI2Njk4MiwiZXhwIjoxNzY5MjcwNTgyfQ.54SImff0QcBw5i3-r1avI5_ykLhRGohhgcol8brtmvw' })
    accessToken!: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4YmNlOS0yNzYwLTQxODktYjk3Yy1hNDlmYTc4NDc0NTMiLCJlbWFpbCI6ImF0aGFydkBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJBdGhhcnYiLCJsYXN0TmFtZSI6IktoYW1rYXIiLCJyb2xlIjoiU1RVREVOVCIsInBob25lTnVtYmVyIjoiKzkxOTg3NjU0MzIxMCIsImlhdCI6MTc2OTI2Njk4MiwiZXhwIjoxNzY5MjcwNTgyfQ.54SImff0QcBw5i3-r1avI5_ykLhRGohhgcol8brtmvw' })
    refreshToken!: string;

    @ApiProperty({ example: false })
    isDisabled!: boolean;

    @ApiProperty({ example: false })
    isDeleted!: boolean;

    constructor(partial: Partial<ClinicOwnerLoginResponseEntity>) {
        Object.assign(this, partial);
    }
}