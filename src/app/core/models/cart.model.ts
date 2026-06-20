import { IProduct } from './product.model';

export interface ICartItem {
  detalleId: number;  // ← debe estar esto
  product: IProduct;
  quantity: number;
  subtotal: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
  itemCount: number;
}

export interface IDetalleCarrito {
  id: number;
  productoId: number;
  productoNombre: string;
  productoImagen: string;  // ← agrega esto
  cantidad: number;
  subtotal: number;
}

export interface ICarritoBackend {
  id: number;
  usuarioNombre: string;
  detalleCarrito: IDetalleCarrito[];
}

export interface IDetalleCarritoRequest {
  productoId: number;
  cantidad: number;
}