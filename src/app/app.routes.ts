import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guard/auth.guard';
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
    canActivate: [authGuard],
    loadChildren: () => import('./features/checkout/checkout.routes')
      .then(m => m.CHECKOUT_ROUTES)
  },
 {
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  loadChildren: () => import('./features/admin/admin.routes')
    .then(m => m.ADMIN_ROUTES)
},
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component')
      .then(m => m.LoginComponent)
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
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  {
    path: 'mis-compras',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mis-compras/mis-compras.component')
      .then(m => m.MisComprasComponent)
  },
  {
  path: 'checkout-success',
  loadComponent: () => import('./features/checkout/pages/checkout-success.component')
    .then(m => m.CheckoutSuccessComponent)
},
{
  path: 'checkout-cancel',
  loadComponent: () => import('./features/checkout/pages/checkout-cancel.component')
    .then(m => m.CheckoutCancelComponent)
},
  {
    path: '**',
    redirectTo: 'home'
  }
];