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