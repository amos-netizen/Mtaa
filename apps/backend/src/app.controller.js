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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("./common/decorators/public.decorator");
let AppController = class AppController {
    getApiInfo() {
        return {
            name: 'Mtaa API',
            version: '1.0.0',
            description: 'Hyperlocal Kenyan Neighborhood Social Network API',
            endpoints: {
                health: '/api/v1/health',
                docs: '/api/docs',
                auth: '/api/v1/auth',
                users: '/api/v1/users',
                posts: '/api/v1/posts',
                notifications: '/api/v1/notifications',
                marketplace: '/api/v1/marketplace/listings',
                jobs: '/api/v1/jobs',
                services: '/api/v1/services',
                bookings: '/api/v1/bookings',
                messages: '/api/v1/conversations',
                neighborhoods: '/api/v1/neighborhoods',
            },
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get API information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getApiInfo", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('App'),
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map