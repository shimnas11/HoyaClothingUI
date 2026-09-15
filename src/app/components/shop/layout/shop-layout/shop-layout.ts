import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductShopService } from '../../../../services/shops/product-shop-service';

@Component({
  selector: 'app-shop-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shop-layout.html',
  standalone: true,
  styleUrl: './shop-layout.css',
})
export class ShopLayout implements OnInit {
  private productStore = inject(ProductShopService);
  readonly navItems: ShopNavItem[] = [
    { label: 'Home', path: '/shop/home', icon: 'home' },
    { label: 'Shop', path: '/shop/products', icon: 'shop' },
    { label: 'Cart', path: '/shop/cart', icon: 'cart' },
    { label: 'Account', path: '/shop/account', icon: 'account' },
  ];

  ngOnInit() {
    this.productStore.loadShopProducts();
  }
}
interface ShopNavItem {
  label: string;
  path: string;
  icon: 'home' | 'shop' | 'cart' | 'account';
}