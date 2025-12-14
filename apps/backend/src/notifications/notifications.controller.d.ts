import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: any, page: number, limit: number): Promise<{
        notifications: {
            id: string;
            createdAt: Date;
            type: string;
            title: string;
            data: string | null;
            userId: string;
            body: string;
            isRead: boolean;
            readAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(user: any): Promise<{
        count: number;
    }>;
    markAsRead(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        title: string;
        data: string | null;
        userId: string;
        body: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsRead(user: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    remove(user: any, id: string): Promise<{
        message: string;
    }>;
}
