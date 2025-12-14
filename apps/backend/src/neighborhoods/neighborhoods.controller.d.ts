import { NeighborhoodsService } from './neighborhoods.service';
export declare class NeighborhoodsController {
    private readonly neighborhoodsService;
    constructor(neighborhoodsService: NeighborhoodsService);
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
