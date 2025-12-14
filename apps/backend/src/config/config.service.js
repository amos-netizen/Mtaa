"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    get nodeEnv() {
        return this.configService.get('NODE_ENV', 'development');
    }
    get port() {
        return this.configService.get('PORT', 3001);
    }
    get databaseUrl() {
        return this.configService.get('DATABASE_URL') || '';
    }
    get redisUrl() {
        return this.configService.get('REDIS_URL');
    }
    get jwtSecret() {
        return this.configService.get('JWT_SECRET') || '';
    }
    get jwtExpiresIn() {
        return this.configService.get('JWT_EXPIRES_IN', '15m');
    }
    get jwtRefreshSecret() {
        return this.configService.get('JWT_REFRESH_SECRET') || this.jwtSecret;
    }
    get jwtRefreshExpiresIn() {
        return this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d');
    }
    get frontendUrl() {
        return this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    }
    get bcryptRounds() {
        return this.configService.get('BCRYPT_ROUNDS', 10);
    }
    get isDevelopment() {
        return this.nodeEnv === 'development';
    }
    get isProduction() {
        return this.nodeEnv === 'production';
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=config.service.js.map