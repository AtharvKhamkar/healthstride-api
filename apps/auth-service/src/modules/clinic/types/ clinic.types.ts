import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }

export type FnCheckClinicOwnerExistsResult = ISqlFnResult<{
    isExists: boolean,
    isVerified: boolean,
}>;

export type FnVerifyClinicOwnerResult = ISqlFnResult<{
    otpId: string,
    otpHash: string
}>;

export type FnRegisterClinicOwnerResult = ISqlFnResult<{
    isRegistered: boolean,
    userId: string,
    expiresAt: string
}>;

export type FnSetInactiveOtpResult = ISqlFnResult<{}>;

export type FnRegisterUserSessionResult = ISqlFnResult<{
    isSessionRegistered: boolean
}>;

