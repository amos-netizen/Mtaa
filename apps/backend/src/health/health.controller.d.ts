import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
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
