import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt"
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtPayload, JwtTokens } from "./jwt.types";

@Injectable()
export class AppJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    extractToken(request: Request): string | null {
        const authHeader = request.headers.authorization;

        if (!authHeader) return null;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }

    async generateTokens(payload: JwtPayload): Promise<JwtTokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload)
        ])

        return { accessToken, refreshToken }
    }


    private async generateAccessToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as any
        });
    }


    private async generateRefreshToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any
        });
    }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN')
        })

        return payload;
    }
}
