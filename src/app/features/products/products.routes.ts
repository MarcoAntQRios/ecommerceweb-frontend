import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/list/product-list.component';
import { ProductDetailComponent } from './pages/detail/product-detail.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: ':id',
    component: ProductDetailComponent
  }
];