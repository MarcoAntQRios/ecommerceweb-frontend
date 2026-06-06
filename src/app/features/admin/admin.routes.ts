import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products-admin.component')
      .then(m => m.ProductsAdminComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders-admin.component')
      .then(m => m.OrdersAdminComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users-admin.component')
      .then(m => m.UsersAdminComponent)
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];