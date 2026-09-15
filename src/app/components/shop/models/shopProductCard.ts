export interface ShopProductCardData {
    id: string;
    name: string;
    material: string;
    imageUrl: string;
    price: number;
    originalPrice?: number;
    badge?: 'New' | 'Bestseller';
    isFavorite?: boolean;
}

export interface ShopProductDetail extends ShopProductCardData {
    images: string[];
    sizes: string[];
    description: string;
}
