import { NeighborhoodsService } from './neighborhoods.service';
export declare class NeighborhoodsController {
    private readonly neighborhoodsService;
    constructor(neighborhoodsService: NeighborhoodsService);
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
