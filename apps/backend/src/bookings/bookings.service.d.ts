import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, page?: number, limit?: number): Promise<{
        bookings: {
            id: string;
            service: {
                neighborhood: {
                    name: string;
                    id: string;
                };
                author: {
                    phoneNumber: string;
                    fullName: string;
                    username: string;
                    profileImageUrl: string;
                    id: string;
                };
            } & {
                description: string;
                type: string;
                title: string;
                neighborhoodId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                category: string | null;
                images: string | null;
                authorId: string;
                videos: string | null;
                isPinned: boolean;
                isAnonymous: boolean;
                engagementScore: number;
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
                name: string;
                id: string;
            };
            author: {
                phoneNumber: string;
                fullName: string;
                username: string;
                email: string;
                profileImageUrl: string;
                id: string;
            };
        } & {
            description: string;
            type: string;
            title: string;
            neighborhoodId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            images: string | null;
            authorId: string;
            videos: string | null;
            isPinned: boolean;
            isAnonymous: boolean;
            engagementScore: number;
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
                fullName: string;
                username: string;
                profileImageUrl: string;
                id: string;
            };
        } & {
            description: string;
            type: string;
            title: string;
            neighborhoodId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            images: string | null;
            authorId: string;
            videos: string | null;
            isPinned: boolean;
            isAnonymous: boolean;
            engagementScore: number;
            reportedById: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        postId: string;
        authorId: string;
        isEdited: boolean;
        parentId: string | null;
    }>;
}
