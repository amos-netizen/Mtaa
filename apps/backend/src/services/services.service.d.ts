import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, neighborhoodId?: string, search?: string, category?: string): Promise<{
        services: ({
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
    }>;
    book(userId: string, serviceId: string, bookingData: {
        preferredDate?: string;
        preferredTime?: string;
        message: string;
    }): Promise<{
        author: {
            phoneNumber: string;
            fullName: string;
            username: string;
            profileImageUrl: string;
            id: string;
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
