import { Gender } from "@app/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class ClinicOwnerRegisterDto {

  @ApiProperty({ example: "Atharv" })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName!: string;

  @ApiPropertyOptional({ example: "Gurudas" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @ApiProperty({ example: "Khamkar" })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: "atharvkhamkar1901@gmail.com" })
  @IsEmail()
  @IsString()
  @MaxLength(200)
  email!: string;

  @ApiProperty({ example: "01a077ce-788a-7015-bc4e-117ec75dda31"})
  @IsUUID()
  countryCodeId!: string;

  @ApiProperty({ example: "+919876543210" })
  @IsMobilePhone()
  phoneNumber!: string;

  @ApiProperty({ example: "Test@123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: "01a077ce-797a-77ae-949f-7cdf1560407f" })
  @IsUUID()
  roleId!: string

  @ApiProperty({ example: "profile-photo-user123" })
  @IsNotEmpty()
  @IsString()
  profile_photo_key!: string;

  @ApiPropertyOptional({example:"2026-05-01"})
  @IsOptional()
  @IsString()
  birth_date?: string;

  @ApiProperty({
    example: Gender.MALE,
    enum: Gender,
    description: "User gender",
  })
  @IsEnum(Gender)
  gender!: Gender
}

