import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(user: any, page?: number, limit?: number): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, body: {
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
    cancel(user: any, id: string): Promise<{
        message: string;
    }>;
}
