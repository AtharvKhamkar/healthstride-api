import { ApiProperty } from '@nestjs/swagger';

export class CheckClinicOwnerExistsEntity {
    @ApiProperty({ example: false })
    isExists!: boolean;

    @ApiProperty({ example: false })
    isVerified!: boolean;

    constructor(partial: Partial<CheckClinicOwnerExistsEntity>) {
        Object.assign(this, partial);
    }
}
