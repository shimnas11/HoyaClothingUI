import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ShopProductCardData } from '../models/shopProductCard';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: ShopProductCardData;
  @Output() favoriteToggle = new EventEmitter<string>();

  get productImageUrl(): string {
    const rawUrl =
      this.product?.imageUrl ??
      (this.product as any)?.image ??
      (this.product as any)?.primaryImageUrl ??
      (this.product as any)?.thumbnailUrl ??
      (this.product as any)?.images?.[0]?.imageUrl ??
      (this.product as any)?.images?.[0]?.url ??
      (this.product as any)?.images?.[0]?.path ??
      '';

    if (!rawUrl) {
      return '';
    }

    const normalized = rawUrl.replace(/\\/g, '/');

    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
      return normalized;
    }

    const match = normalized.match(/\/images\/.*$/i);
    const publicPath = match ? match[0] : normalized.replace(/^.*?(\/images\/.*)$/, '$1');
    const cleanPath = publicPath.startsWith('/') ? publicPath : `/${publicPath}`;

    return `${environment.apiUrl.replace(/\/api$/, '')}${cleanPath}`;
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteToggle.emit(this.product.id);
  }
}
