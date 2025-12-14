import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, page?: number, limit?: number): Promise<{
        bookings: {
            id: string;
            service: {
                neighborhood: {
                    id: string;
                    name: string;
                };
                author: {
                    id: string;
                    username: string;
                    phoneNumber: string;
                    fullName: string;
                    profileImageUrl: string;
                };
            } & {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                category: string | null;
                title: string;
                images: string | null;
                videos: string | null;
                isPinned: boolean;
                isAnonymous: boolean;
                engagementScore: number;
                authorId: string;
                neighborhoodId: string;
                reportedById: string | null;
            };
            message: string;
            createdAt: Date;
            status: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        service: {
            neighborhood: {
                id: string;
                name: string;
            };
            author: {
                id: string;
                username: string;
                email: string;
                phoneNumber: string;
                fullName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            category: string | null;
            title: string;
            images: string | null;
            videos: string | null;
            isPinned: boolean;
            isAnonymous: boolean;
            engagementScore: number;
            authorId: string;
            neighborhoodId: string;
            reportedById: string | null;
        };
        message: string;
        createdAt: Date;
        status: string;
    }>;
    cancel(userId: string, id: string): Promise<{
        message: string;
    }>;
    update(userId: string, id: string, data: {
        preferredDate?: string;
        preferredTime?: string;
        message?: string;
    }): Promise<{
        post: {
            author: {
                id: string;
                username: string;
                fullName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            category: string | null;
            title: string;
            images: string | null;
            videos: string | null;
            isPinned: boolean;
            isAnonymous: boolean;
            engagementScore: number;
            authorId: string;
            neighborhoodId: string;
            reportedById: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        isEdited: boolean;
        postId: string;
        parentId: string | null;
    }>;
}
