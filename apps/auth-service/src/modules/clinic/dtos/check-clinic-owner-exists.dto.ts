import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class CheckClinicOwnerExistsDto {
  @ApiProperty({ example: "atharvkhamkar1901@gmail.com" })
  @IsEmail()
  @IsString()
  @MaxLength(150)
  email!: string;
}

