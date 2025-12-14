import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
export declare class MarketplaceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(neighborhoodId?: string, category?: string, search?: string, page?: number, limit?: number): Promise<{
        listings: {
            images: any;
            neighborhood: {
                id: string;
                name: string;
            };
            post: {
                id: string;
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
            category: string;
            title: string;
            authorId: string;
            neighborhoodId: string;
            postId: string;
            expiresAt: Date;
            price: number | null;
            isFree: boolean;
            condition: string | null;
            pickupLocation: string | null;
            deliveryAvailable: boolean;
            isSold: boolean;
            soldAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        images: any;
        neighborhood: {
            id: string;
            name: string;
        };
        post: {
            comments: ({
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
            likes: {
                id: string;
                createdAt: Date;
                postId: string;
                userId: string;
            }[];
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
        author: {
            id: string;
            username: string;
            phoneNumber: string;
            fullName: string;
            profileImageUrl: string;
        };
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        title: string;
        authorId: string;
        neighborhoodId: string;
        postId: string;
        expiresAt: Date;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
    }>;
    create(userId: string, createListingDto: CreateListingDto): Promise<{
        images: any;
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
        category: string;
        title: string;
        authorId: string;
        neighborhoodId: string;
        postId: string;
        expiresAt: Date;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
    }>;
    update(userId: string, id: string, updateData: Partial<CreateListingDto>): Promise<{
        images: any;
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
        category: string;
        title: string;
        authorId: string;
        neighborhoodId: string;
        postId: string;
        expiresAt: Date;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
    }>;
    markAsSold(userId: string, id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        title: string;
        images: string;
        authorId: string;
        neighborhoodId: string;
        postId: string;
        expiresAt: Date;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
