import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    findAll(neighborhoodId?: string, category?: string, search?: string, page?: number, limit?: number): Promise<{
        listings: {
            images: any;
            neighborhood: {
                name: string;
                id: string;
            };
            post: {
                id: string;
            };
            author: {
                fullName: string;
                username: string;
                profileImageUrl: string;
                id: string;
            };
            description: string;
            title: string;
            neighborhoodId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date;
            category: string;
            price: number | null;
            isFree: boolean;
            condition: string | null;
            pickupLocation: string | null;
            deliveryAvailable: boolean;
            isSold: boolean;
            soldAt: Date | null;
            postId: string;
            authorId: string;
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
            name: string;
            id: string;
        };
        post: {
            comments: ({
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
            likes: {
                id: string;
                createdAt: Date;
                userId: string;
                postId: string;
            }[];
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
        author: {
            phoneNumber: string;
            fullName: string;
            username: string;
            profileImageUrl: string;
            id: string;
        };
        description: string;
        title: string;
        neighborhoodId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date;
        category: string;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
        postId: string;
        authorId: string;
    }>;
    create(user: any, createListingDto: CreateListingDto): Promise<{
        images: any;
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
        title: string;
        neighborhoodId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date;
        category: string;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
        postId: string;
        authorId: string;
    }>;
    update(user: any, id: string, updateData: Partial<CreateListingDto>): Promise<{
        images: any;
        author: {
            fullName: string;
            username: string;
            profileImageUrl: string;
            id: string;
        };
        description: string;
        title: string;
        neighborhoodId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date;
        category: string;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
        postId: string;
        authorId: string;
    }>;
    markAsSold(user: any, id: string): Promise<{
        description: string;
        title: string;
        neighborhoodId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date;
        category: string;
        price: number | null;
        isFree: boolean;
        condition: string | null;
        images: string;
        pickupLocation: string | null;
        deliveryAvailable: boolean;
        isSold: boolean;
        soldAt: Date | null;
        postId: string;
        authorId: string;
    }>;
    remove(user: any, id: string): Promise<{
        message: string;
    }>;
}
