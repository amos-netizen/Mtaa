import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    findAll(page?: number, limit?: number, neighborhoodId?: string, search?: string): Promise<{
        jobs: ({
            neighborhood: {
                id: string;
                name: string;
            };
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
    create(user: any, body: {
        title: string;
        description: string;
        neighborhoodId: string;
        category?: string;
        images?: string[];
        salary?: string;
        jobType?: string;
    }): Promise<{
        neighborhood: {
            id: string;
            name: string;
        };
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
    }>;
    update(user: any, id: string, body: {
        title?: string;
        description?: string;
        category?: string;
        images?: string[];
    }): Promise<{
        neighborhood: {
            id: string;
            name: string;
        };
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
    }>;
    remove(user: any, id: string): Promise<{
        message: string;
    }>;
    apply(user: any, id: string, body: {
        coverLetter: string;
        resumeUrl?: string;
    }): Promise<{
        author: {
            id: string;
            username: string;
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
