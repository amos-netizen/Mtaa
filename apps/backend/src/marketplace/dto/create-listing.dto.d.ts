export declare class CreateListingDto {
    neighborhoodId: string;
    category: string;
    title: string;
    description: string;
    price?: number;
    isFree?: boolean;
    condition?: string;
    images: string[];
    pickupLocation?: string;
    deliveryAvailable?: boolean;
}
