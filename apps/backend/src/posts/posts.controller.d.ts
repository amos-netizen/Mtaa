import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(page?: number, limit?: number, neighborhoodId?: string, category?: string): Promise<{
        posts: {
            likeCount: number;
            commentCount: number;
            neighborhood: {
                name: string;
                id: string;
            };
            _count: {
                comments: number;
                likes: number;
            };
            author: {
                fullName: string;
                username: string;
                profileImageUrl: string;
                id: string;
            };
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
            name: string;
            id: string;
        };
        author: {
            fullName: string;
            username: string;
            profileImageUrl: string;
            id: string;
        };
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
        type?: string;
        images?: string[];
        videos?: string[];
        isAnonymous?: boolean;
    }): Promise<{
        likeCount: number;
        commentCount: number;
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
    update(user: any, id: string, body: {
        title?: string;
        description?: string;
        category?: string;
        images?: string[];
        videos?: string[];
    }): Promise<{
        likeCount: number;
        commentCount: number;
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
    remove(user: any, id: string): Promise<{
        message: string;
    }>;
    getComments(postId: string, page?: number, limit?: number): Promise<{
        comments: ({
            author: {
                fullName: string;
                username: string;
                profileImageUrl: string;
                id: string;
            };
            replies: ({
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
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            postId: string;
            authorId: string;
            isEdited: boolean;
            parentId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createComment(user: any, postId: string, body: {
        content: string;
        parentId?: string;
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
    updateComment(user: any, id: string, body: {
        content: string;
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
    deleteComment(user: any, id: string): Promise<{
        message: string;
    }>;
    toggleLike(user: any, postId: string): Promise<{
        liked: boolean;
    }>;
}
