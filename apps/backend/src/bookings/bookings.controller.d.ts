import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(user: any, page?: number, limit?: number): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, body: {
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
    cancel(user: any, id: string): Promise<{
        message: string;
    }>;
}
