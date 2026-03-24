export interface ProductSize {
    size: string;
    quantity: number;
}

export interface Product {
    id: string;
    name: string;
    code: string;
    color: string;
    cost: number;
    sellingPrice: number;
    sizes: ProductSize[];
    totalQuantity: number;
}