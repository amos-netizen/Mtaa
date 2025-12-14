import { PrismaService } from '../prisma/prisma.service';
export declare class NeighborhoodsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(city?: string, search?: string): Promise<{
        neighborhoods: {
            id: string;
            name: string;
            city: string;
            county: string | null;
            description: string | null;
            centerLatitude: number | null;
            centerLongitude: number | null;
            boundaryCoordinates: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        city: string;
        county: string | null;
        description: string | null;
        centerLatitude: number | null;
        centerLongitude: number | null;
        boundaryCoordinates: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
