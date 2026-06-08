import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes')
      .then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes')
      .then(m => m.CART_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes')
      .then(m => m.CHECKOUT_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'recomendador',
    loadComponent: () => import('./features/recomendador/recomendador.component')
      .then(m => m.RecomendadorComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];