import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
            type: string;
            title: string;
            id: string;
            createdAt: Date;
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
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(userId: string, notificationId: string): Promise<{
        type: string;
        title: string;
        id: string;
        createdAt: Date;
        data: string | null;
        userId: string;
        body: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    remove(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
}
