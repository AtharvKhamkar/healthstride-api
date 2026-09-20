import { INestApplication } from "@nestjs/common";

export interface SwaggerSetupConfigType {
  app: INestApplication,
  title: string,
  description: string,
  apiVersion: string,
  route: string
}

export interface IPgQuery {
  query: string,
  params?: any[]
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}


// Type definitions for MongoDB operations
export interface IMongoFilter {
  [key: string]: any;
}

export interface IMongoProjection {
  [key: string]: number;
}

export interface IMongoOptions {
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  projection?: IMongoProjection;
}

export interface IMongoQuery<T = any> {
  filter: IMongoFilter;
  options?: IMongoOptions;
}

export interface IMongoInsert<T = any> {
  document: T | T[];
}

export interface IMongoUpdate {
  filter: IMongoFilter;
  update: Record<string, any>;
  options?: {
    upsert?: boolean;
    multi?: boolean;
  };
}

export interface IMongoAggregation {
  pipeline: any[];
  options?: {
    allowDiskUse?: boolean;
    cursor?: { batchSize?: number };
  };
}

export interface PaginatedResult<T = any> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CursorPaginatedResult<T = any> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}


export enum OtpPurpose {
  forgotPassword = 'FORGOT_PASSWORD',
  emailVerification = 'EMAIL_VERIFICATION',
  phoneVerification = 'PHONE_VERIFICATION',
  passwordReset = 'PASSWORD_RESET',
  loginOtp = 'LOGIN_OTP',
  twoFactorAuth = 'TWO_FACTOR_AUTH'
}

export enum DevicePlatform {
  ios = 'IOS',
  android = 'ANDROID',
  web = 'WEB'
}


export interface IWelcomeEmailEventPayload {
  email: string,
  name: string
}

export interface IForgotPasswordEmailEventPayload {
  email: string,
  name: string,
  otp: string,
  expiresAt: string
}

export interface IEmailVerifyEmailEventPayload {
  email: string,
  name: string,
  otp: string,
  expiresAt: string
}

export interface FnGetUserProfileDetails<IUserDb> extends ApiResponse<IUserDb> { }


export interface IUserDb {
  user_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  password: string;
  profile_image: string | null;
  clinic_name: string | null;
  role: string;
  gender: Gender
  is_verified: boolean;
  access_token: string | null;
  refresh_token: string | null;
  is_disabled: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

