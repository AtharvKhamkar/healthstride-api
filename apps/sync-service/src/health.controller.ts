import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthCheckController {

    constructor() { }

    @Get('/health')
    async healthCheck() {
        return 'Healthy';
    }
}