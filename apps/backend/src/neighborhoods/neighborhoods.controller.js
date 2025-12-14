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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighborhoodsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const neighborhoods_service_1 = require("./neighborhoods.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let NeighborhoodsController = class NeighborhoodsController {
    neighborhoodsService;
    constructor(neighborhoodsService) {
        this.neighborhoodsService = neighborhoodsService;
    }
    async findAll(city, search) {
        return this.neighborhoodsService.findAll(city, search);
    }
    async findOne(id) {
        return this.neighborhoodsService.findOne(id);
    }
};
exports.NeighborhoodsController = NeighborhoodsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all neighborhoods' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NeighborhoodsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single neighborhood by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NeighborhoodsController.prototype, "findOne", null);
exports.NeighborhoodsController = NeighborhoodsController = __decorate([
    (0, swagger_1.ApiTags)('Neighborhoods'),
    (0, common_1.Controller)('neighborhoods'),
    __metadata("design:paramtypes", [neighborhoods_service_1.NeighborhoodsService])
], NeighborhoodsController);
//# sourceMappingURL=neighborhoods.controller.js.map