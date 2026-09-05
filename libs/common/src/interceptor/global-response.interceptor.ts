import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResponse } from "../types/common.types";
import { map } from "rxjs/operators";

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>) {

        return next.handle().pipe(
            map((response: ApiResponse<any>) => {

                // If already formatted, return as is
                if (
                    response &&
                    typeof response.success === 'boolean' &&
                    'message' in response &&
                    'data' in response
                ) {
                    return response;
                }

                return {
                    success: true,
                    message: 'Request successful',
                    data: response ?? null,
                } as ApiResponse;
            }),
        );

    }
} 