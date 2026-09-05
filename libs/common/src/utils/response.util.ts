import { ApiResponse } from "../types/common.types";

export class ResponseUtil {
    static success<T>(
        message: string,
        data: T | null = null
    ): ApiResponse<T> {
        return {
            success: true,
            message: message,
            data: data
        }
    }

    static failure<T>(
        message: string,
        data: T | null = null
    ): ApiResponse<T> {
        return {
            success: false,
            message: message,
            data: data
        }
    }
} 