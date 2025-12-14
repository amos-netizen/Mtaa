import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, neighborhoodId?: string, category?: string): Promise<{
        posts: {
            likeCount: number;
            commentCount: number;
            neighborhood: {
                id: string;
                name: string;
            };
            _count: {
                comments: number;
                likes: number;
            };
            author: {
                id: string;
                username: string;
                fullName: string;
                profileImageUrl: string;
            };
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        likeCount: number;
        commentCount: number;
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
        type?: string;
        images?: string[];
        videos?: string[];
        isAnonymous?: boolean;
    }): Promise<{
        likeCount: number;
        commentCount: number;
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
    update(userId: string, id: string, data: {
        title?: string;
        description?: string;
        category?: string;
        images?: string[];
        videos?: string[];
    }): Promise<{
        likeCount: number;
        commentCount: number;
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
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    getComments(postId: string, page?: number, limit?: number): Promise<{
        comments: ({
            author: {
                id: string;
                username: string;
                fullName: string;
                profileImageUrl: string;
            };
            replies: ({
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
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            isEdited: boolean;
            postId: string;
            parentId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createComment(userId: string, postId: string, content: string, parentId?: string): Promise<{
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
    updateComment(userId: string, commentId: string, content: string): Promise<{
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
    deleteComment(userId: string, commentId: string): Promise<{
        message: string;
    }>;
    toggleLike(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
}
