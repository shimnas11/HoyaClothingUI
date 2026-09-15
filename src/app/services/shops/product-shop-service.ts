import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductShopService {
  private apiUrl = environment.apiUrl;
  products = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  private normalizeImageUrl(url?: string): string {
    if (!url) {
      return '';
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (url.startsWith('/')) {
      return `${this.apiUrl}${url}`;
    }

    return `${this.apiUrl}/${url.replace(/^\.\//, '')}`;
  }

  private normalizeProduct(product: any): any {
    const imageList = Array.isArray(product?.images) ? product.images : [];
    const firstImage =
      product?.imageUrl ??
      product?.image ??
      product?.primaryImageUrl ??
      product?.thumbnailUrl ??
      imageList.find((img: any) => img?.imageUrl || img?.url || img?.path)?.imageUrl ??
      imageList.find((img: any) => img?.imageUrl || img?.url || img?.path)?.url ??
      imageList[0]?.imageUrl ??
      imageList[0]?.url ??
      imageList[0]?.path ??
      '';

    const normalizedImages = (Array.isArray(product?.images) ? product.images : []).map((img: any, index: number) => ({
      id: img?.id ?? `${product?.id ?? 'product'}-${index}`,
      imageUrl: this.normalizeImageUrl(img?.imageUrl ?? img?.url ?? img?.path ?? ''),
      isPrimary: Boolean(img?.isPrimary ?? index === 0),
      sortOrder: Number(img?.sortOrder ?? index),
    }));

    const resolvedPrice = Number(product?.price ?? product?.sellingPrice ?? product?.salePrice ?? 0);
    const resolvedOriginalPrice = product?.originalPrice ?? product?.mrp ?? product?.compareAtPrice ?? undefined;

    return {
      ...product,
      id: product?.id ?? product?.productId,
      name: product?.name ?? product?.productName,
      material: product?.material ?? product?.fabric ?? product?.categoryName ?? '',
      imageUrl: this.normalizeImageUrl(firstImage),
      images: normalizedImages.length ? normalizedImages : (firstImage ? [{ id: `primary-${product?.id ?? 'product'}`, imageUrl: this.normalizeImageUrl(firstImage), isPrimary: true, sortOrder: 0 }] : []),
      price: resolvedPrice,
      originalPrice: resolvedOriginalPrice,
      badge: product?.badge ?? (product?.isNew ? 'New' : product?.isBestseller ? 'Bestseller' : undefined),
      isFavorite: !!product?.isFavorite,
    };
  }

  loadShopProducts() {
    this.http.get<any[]>(`${this.apiUrl}/products/GetShopProducts`)
      .subscribe({
        next: (res) => {
          const normalized = Array.isArray(res) ? res.map((product) => this.normalizeProduct(product)) : [];
          this.products.set(normalized);
        },
        error: (err) => {
          console.error('Error loading products', err);
        }
      });
  }
}
