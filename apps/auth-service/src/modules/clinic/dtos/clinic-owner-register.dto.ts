import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

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

  @ApiProperty({ example: "e819951e-eca1-49b5-9e2d-2e9b08208d6f" })
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

  @ApiProperty({ example: "1d5ef201-0972-4daa-b724-4325dcf28031" })
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

  @ApiProperty({ example: "1d5ef201-0972-4daa-b724-4325dcf28031" })
  @IsUUID()
  gender!: string
}

