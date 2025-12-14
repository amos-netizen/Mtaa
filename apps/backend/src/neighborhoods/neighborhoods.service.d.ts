import { PrismaService } from '../prisma/prisma.service';
export declare class NeighborhoodsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(city?: string, search?: string): Promise<{
        neighborhoods: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            county: string | null;
            centerLatitude: number | null;
            centerLongitude: number | null;
            boundaryCoordinates: string | null;
        }[];
    }>;
    findOne(id: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        county: string | null;
        centerLatitude: number | null;
        centerLongitude: number | null;
        boundaryCoordinates: string | null;
    }>;
}
