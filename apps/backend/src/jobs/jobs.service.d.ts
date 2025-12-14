import { PrismaService } from '../prisma/prisma.service';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, neighborhoodId?: string, search?: string): Promise<{
        jobs: ({
            neighborhood: {
                name: string;
                id: string;
            };
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
        salary?: string;
        jobType?: string;
    }): Promise<{
        neighborhood: {
            name: string;
            id: string;
        };
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
    }>;
    update(userId: string, id: string, data: {
        title?: string;
        description?: string;
        category?: string;
        images?: string[];
    }): Promise<{
        neighborhood: {
            name: string;
            id: string;
        };
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
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    apply(userId: string, jobId: string, applicationData: {
        coverLetter: string;
        resumeUrl?: string;
    }): Promise<{
        author: {
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
