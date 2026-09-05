import { ApiProperty } from '@nestjs/swagger';

export class ClinicOwnerRegisterResponseEntity {
    @ApiProperty({ example: false })
    isRegistered!: boolean;


    constructor(partial: Partial<ClinicOwnerRegisterResponseEntity>) {
        Object.assign(this, partial);
    }
}
