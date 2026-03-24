import { Routes } from '@angular/router';
import { ProductLanding } from './components/Products/product-landing/product-landing';
import { InvoiceList } from './components/Invoices/invoice-list/invoice-list';
import { DashboardComponent } from './components/Dashboard/dashboard/dashboard';
import { LoginComponent } from './components/Users/login/login';
import { authGuard } from './guards/auth-guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { ExhibitionLanding } from './components/Exhibitions/exhibition-landing/exhibition-landing';
import { DetailExhition } from './components/Exhibitions/detail-exhibition/detail-exhition';


export const routes = [

    // 🧩 Main layout (with sidebar)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'products',
                component: ProductLanding, renderMode: 'client'
            },
            {
                path: 'invoices',
                component: InvoiceList, renderMode: 'client'
            },
            {
                path: 'dashboard',
                component: DashboardComponent, renderMode: 'client'
            },
            {
                path: 'exhibitions',
                component: ExhibitionLanding, renderMode: 'client'
            },
            {
                path: 'details/:id',
                component: DetailExhition,
                renderMode: 'client'
            },
        ]
    },
    // 🔐 Auth layout (no sidebar)

    {
        path: '',
        component: AuthLayoutComponent,

        children: [
            { path: 'login', component: LoginComponent, renderMode: 'client' },
        ]
    },

    { path: '**', redirectTo: 'login', renderMode: 'client' }
];
