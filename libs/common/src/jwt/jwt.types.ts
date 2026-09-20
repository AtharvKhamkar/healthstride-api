export interface JwtPayload {
    sub: string,
    email: string,
    role: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    phoneNumber: string,
}

export interface JwtTokens {
    accessToken: string,
    refreshToken: string
}