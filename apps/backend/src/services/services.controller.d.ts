import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
    create(user: any, body: {
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
    book(user: any, id: string, body: {
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
