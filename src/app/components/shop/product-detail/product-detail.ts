import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ProductCard } from '../product-card/product-card';
import { ProductShopService } from '../../../services/shops/product-shop-service';
import { ShopProductCardData } from '../models/shopProductCard';

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductSize {
  size: string;
  quantity: number;
}

export interface Product extends ShopProductCardData {
  code: string;
  description: string;
  color: string;
  cost: number;
  sellingPrice: number;
  sizes: ProductSize[];
  totalQuantity: number;
  images: ProductImage[];
  isActive: boolean;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  activeImageIndex = 0;
  selectedSize = '';
  quantity = 1;
  justAdded = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductShopService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      this.loadProduct(productId);
    });
  }

  private loadProduct(productId: string | null): void {
    if (!productId) {
      this.router.navigate(['/shop/products']);
      return;
    }

    const shopProducts = this.productService.products();
    const selectedProduct = shopProducts.find((item: any) => item.id === productId);

    this.product = selectedProduct ?? null;
    this.relatedProducts = shopProducts.filter((item: any) => item.id !== productId).slice(0, 4);

    if (!this.product) {
      return;
    }

    this.initializeProduct();
  }

  private initializeProduct(): void {
    if (!this.product) {
      return;
    }

    const primaryIndex = this.product.images?.findIndex((image) => image.isPrimary) ?? -1;
    this.activeImageIndex = primaryIndex >= 0 ? primaryIndex : 0;

    const availableSize = this.product.sizes?.find((size) => size.quantity > 0);
    this.selectedSize = availableSize?.size ?? '';
    this.quantity = 1;
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }

    const normalized = imageUrl.replace(/\\/g, '/');

    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
      return normalized.replace(/\/api(?=\/)/i, '');
    }

    const match = normalized.match(/\/images\/.*$/i);
    const publicPath = match ? match[0] : normalized.replace(/^.*?(\/images\/.*)$/, '$1');
    const cleanPath = publicPath.startsWith('/') ? publicPath : `/${publicPath}`;

    const baseUrl = environment.apiUrl
      .replace(/\/api\/?$/, '')
      .replace(/\/$/, '');
    console.log('Product Image URL:', `${baseUrl}${cleanPath}`);
    return `${baseUrl}${cleanPath}`;
    // return `${environment.apiUrl.replace(/\/api$/, '')}${cleanPath}`;
  }

  selectImage(index: number): void {
    if (!this.product?.images?.length || index < 0 || index >= this.product.images.length) {
      return;
    }

    this.activeImageIndex = index;
  }

  get availableStock(): number {
    if (!this.product || !this.selectedSize) {
      return 0;
    }

    const selected = this.product.sizes?.find((item) => item.size === this.selectedSize);
    return selected?.quantity ?? 0;
  }

  selectSize(size: string): void {
    const selected = this.product?.sizes?.find((item) => item.size === size);
    if (!selected || selected.quantity <= 0) {
      return;
    }

    this.selectedSize = size;
    this.quantity = 1;
  }

  increaseQuantity(): void {
    if (this.quantity < this.availableStock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleFavorite(): void {
    if (!this.product) {
      return;
    }

    this.product.isFavorite = !this.product.isFavorite;
  }

  onAddToCart(): void {
    if (!this.product || !this.selectedSize || this.availableStock <= 0) {
      return;
    }

    const cartItem = {
      productId: this.product.id,
      name: this.product.name,
      code: this.product.code,
      imageUrl: this.product.images?.[this.activeImageIndex]?.imageUrl ?? '',
      price: this.product.sellingPrice,
      size: this.selectedSize,
      quantity: this.quantity,
    };

    console.log('Add to cart:', cartItem);
    this.justAdded = true;
    setTimeout(() => {
      this.justAdded = false;
    }, 1500);
  }

  onRelatedFavoriteToggle(productId: string): void {
    const product = this.relatedProducts.find((item) => item.id === productId);
    if (product) {
      product.isFavorite = !product.isFavorite;
    }
  }
}