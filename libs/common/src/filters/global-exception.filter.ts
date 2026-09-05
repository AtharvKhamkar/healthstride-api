import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { MESSAGES } from "@nestjs/core/constants";
import { ApiResponse } from "../types/common.types";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const response = exception.getResponse();

            message = typeof response == 'string' ? response : (response as any)?.message;
        }

        const apiResponse: ApiResponse = {
            success: false,
            message: message,
            data: null
        };

        res.status(status).json(apiResponse);
    }

}