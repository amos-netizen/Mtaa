import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, neighborhoodId?: string, search?: string, category?: string): Promise<{
        services: ({
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    }>;
    create(userId: string, data: {
        title: string;
        description: string;
        neighborhoodId: string;
        category?: string;
        images?: string[];
        price?: number;
        serviceType?: string;
    }): Promise<{
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
    }>;
    book(userId: string, serviceId: string, bookingData: {
        preferredDate?: string;
        preferredTime?: string;
        message: string;
    }): Promise<{
        author: {
            id: string;
            username: string;
            phoneNumber: string;
            fullName: string;
            profileImageUrl: string;
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
