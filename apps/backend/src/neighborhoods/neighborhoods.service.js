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
exports.NeighborhoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NeighborhoodsService = class NeighborhoodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(city, search) {
        const where = {
            isActive: true,
        };
        if (city) {
            where.city = city;
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { city: { contains: search } },
            ];
        }
        const neighborhoods = await this.prisma.neighborhood.findMany({
            where,
            orderBy: [
                { city: 'asc' },
                { name: 'asc' },
            ],
        });
        return {
            neighborhoods,
        };
    }
    async findOne(id) {
        const neighborhood = await this.prisma.neighborhood.findUnique({
            where: { id },
        });
        if (!neighborhood) {
            throw new common_1.NotFoundException('Neighborhood not found');
        }
        return neighborhood;
    }
};
exports.NeighborhoodsService = NeighborhoodsService;
exports.NeighborhoodsService = NeighborhoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NeighborhoodsService);
//# sourceMappingURL=neighborhoods.service.js.map