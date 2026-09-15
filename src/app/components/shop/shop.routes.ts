import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./layout/shop-layout/shop-layout').then((m) => m.ShopLayout),
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                loadComponent: () => import('./home/home').then((m) => m.Home),
            },

            {
                path: 'products',
                loadComponent: () =>
                    import('./product-list/product-list').then((m) => m.ProductList),
            },
            {
                path: 'products/:id',
                loadComponent: () =>
                    import('./product-detail/product-detail').then((m) => m.ProductDetail),
            },
            // {
            //   path: 'cart',
            //   loadComponent: () => import('./cart/cart').then((m) => m.CartComponent),
            // },
            // {
            //   path: 'checkout',
            //   loadComponent: () => import('./checkout/checkout').then((m) => m.CheckoutComponent),
            // },
            // {
            //   path: 'orders',
            //   loadComponent: () => import('./orders/orders').then((m) => m.OrdersComponent),
            // },
            // {
            //   path: 'account',
            //   loadComponent: () => import('./account/account').then((m) => m.AccountComponent),
            // },
        ],
    },
];