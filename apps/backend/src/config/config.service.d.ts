import { ConfigService as NestConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private configService;
    constructor(configService: NestConfigService);
    get nodeEnv(): string;
    get port(): number;
    get databaseUrl(): string;
    get redisUrl(): string | undefined;
    get jwtSecret(): string;
    get jwtExpiresIn(): string;
    get jwtRefreshSecret(): string;
    get jwtRefreshExpiresIn(): string;
    get frontendUrl(): string;
    get bcryptRounds(): number;
    get isDevelopment(): boolean;
    get isProduction(): boolean;
}
