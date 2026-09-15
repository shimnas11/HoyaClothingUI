import { LoginComponent } from './components/Users/login/login';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
export const routes = [

    // 🧩 Main layout (with sidebar)
    {
        path: '',
        loadChildren: () =>
            import('./components/Admin/admin.routes')
                .then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'shop',
        loadChildren: () =>
            import('./components/shop/shop.routes')
                .then(m => m.SHOP_ROUTES)
    },


    {
        path: '',
        component: AuthLayoutComponent,

        children: [
            { path: 'login', component: LoginComponent, renderMode: 'client' },
        ]
    },

    { path: '**', redirectTo: 'login', renderMode: 'client' }
];
