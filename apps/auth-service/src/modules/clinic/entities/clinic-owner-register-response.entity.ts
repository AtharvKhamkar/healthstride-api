import { ApiProperty } from '@nestjs/swagger';

export class ClinicOwnerRegisterResponseEntity {
    @ApiProperty({ example: false })
    isRegistered!: boolean;

    @ApiProperty({example: false})
    userId!: string;

    @ApiProperty({example: false})
    expiresAt!: string


    constructor(partial: Partial<ClinicOwnerRegisterResponseEntity>) {
        Object.assign(this, partial);
    }
}
