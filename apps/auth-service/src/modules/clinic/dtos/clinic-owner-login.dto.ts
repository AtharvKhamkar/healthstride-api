import { DevicePlatform } from "@app/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ClinicOwnerLoginDto {
    @ApiProperty({ example: "atharvkhamkar1901@gmail.com" })
    @IsEmail()
    @IsString()
    @MaxLength(150)
    email!: string;

    @ApiProperty({ example: "Test@123" })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string;

    @ApiProperty({ example: DevicePlatform.web, enum: DevicePlatform })
    @IsEnum(DevicePlatform)
    platform!: DevicePlatform;

    @ApiPropertyOptional({ example: "Mozilla/5.0 ... Chrome/120" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    deviceInfo?: string;

}

