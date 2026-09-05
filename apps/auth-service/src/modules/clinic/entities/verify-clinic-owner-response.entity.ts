import { ApiProperty } from '@nestjs/swagger';

export class VerifyClinicOwnerResponseEntity {
    
    @ApiProperty({ example: false })
    isVerified!: boolean;

    constructor(partial: Partial<VerifyClinicOwnerResponseEntity>) {
        Object.assign(this, partial);
    }
}
