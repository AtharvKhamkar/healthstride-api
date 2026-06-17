import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerSetupConfigType } from "../types/common.types";

export function setupSwagger(config: SwaggerSetupConfigType) {
    try {
        const swaggerConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.apiVersion)
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'Enter JWT token',
                    in: 'header',
                },
                'access-token',
            )
            .build()

        const document = SwaggerModule.createDocument(config.app, swaggerConfig);

        SwaggerModule.setup(config.route, config.app, document);

    } catch (error) {
        console.log(`ERROR :: SwaggerConfig.setupSwagger :: ${error}`);

    }
}