import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth-guard';


export const ADMIN_ROUTES: Routes = [

    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/main-layout/main-layout')
                .then(m => m.MainLayoutComponent),

        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'damages',
                loadComponent: () =>
                    import('./Products/damaged-products/damaged-products')
                        .then(m => m.DamagedProducts)
            },
            {
                path: 'additional-expenses',
                loadComponent: () =>
                    import('./Masters/AdditionalExpenses/additional-expense/additional-expense')
                        .then(m => m.AdditionalExpense)
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./Dashboard/dashboard/dashboard')
                        .then(m => m.DashboardComponent)
            },

            {
                path: 'products',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./Products/product-landing/product-landing')
                                .then(m => m.ProductLanding)
                    },
                    {
                        path: 'create',
                        loadComponent: () =>
                            import('./Products/create-product/create-product')
                                .then(m => m.CreateProduct)
                    },
                    {
                        path: ':id',
                        loadComponent: () =>
                            import('./Products/product-detail/product-detail')
                                .then(m => m.ProductDetailComponent)
                    },


                ]
            },

            {
                path: 'invoices',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./Invoices/invoice-list/invoice-list')
                                .then(m => m.InvoiceList)
                    },

                    {
                        path: ':id',
                        loadComponent: () =>
                            import('./Invoices/invoice-details/invoice-details')
                                .then(m => m.InvoiceDetailComponent)
                    }
                ]
            },

            {

                path: 'exhibitions',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./Exhibitions/exhibition-landing/exhibition-landing')
                                .then(m => m.ExhibitionLanding)
                    }, {
                        path: ':id',
                        loadComponent: () =>
                            import('./Exhibitions/detail-exhibition/detail-exhition')
                                .then(m => m.DetailExhition)
                    }


                ]
            }
        ]
    }
];