import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppJwtService } from "./jwt.service";
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
    imports: [ConfigModule, NestJwtModule],
    providers: [AppJwtService],
    exports: [AppJwtService]
})


export class AppJwtModule { } 