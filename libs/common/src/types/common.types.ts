import { INestApplication } from "@nestjs/common";

export interface SwaggerSetupConfigType {
    app: INestApplication,
    title: string,
    description: string,
    apiVersion: string,
    route: string
}