import { IProduct } from './product.model';

export interface ICartItem {
  product: IProduct;
  quantity: number;
  subtotal: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
  itemCount: number;
}