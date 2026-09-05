import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }

export type FnCheckClinicOwnerExistsResult = ISqlFnResult<{
    isExists: boolean,
    isVerified: boolean,
}>;
