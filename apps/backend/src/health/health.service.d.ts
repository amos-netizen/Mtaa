import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
    detailedCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        database: {
            status: string;
            responseTime: number;
        };
    }>;
}
