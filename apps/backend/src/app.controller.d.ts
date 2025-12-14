export declare class AppController {
    getApiInfo(): {
        name: string;
        version: string;
        description: string;
        endpoints: {
            health: string;
            docs: string;
            auth: string;
            users: string;
            posts: string;
            notifications: string;
            marketplace: string;
            jobs: string;
            services: string;
            bookings: string;
            messages: string;
            neighborhoods: string;
        };
    };
}
