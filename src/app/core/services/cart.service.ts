import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ICart,
  ICartItem,
  ICarritoBackend,
  IDetalleCarritoRequest
} from '../models/cart.model';
import { IProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = 'http://localhost:8060/api';
  private carritoId: number | null = null;

  private cartSubject = new BehaviorSubject<ICart>({
    items: [],
    total: 0,
    itemCount: 0
  });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  private mapearCarrito(backend: ICarritoBackend): ICart {
  const items: ICartItem[] = backend.detalleCarrito
    .sort((a, b) => a.id - b.id)  // ← agrega esto
    .map(detalle => ({
      detalleId: detalle.id,
      product: {
        id: detalle.productoId,
        nombre: detalle.productoNombre,
        precio: detalle.subtotal / detalle.cantidad,
        descripcion: '',
        stock: 0,
        imagen: detalle.productoImagen ?? '',
        tipoNombre: '',
        categoriaNombre: ''
      },
      quantity: detalle.cantidad,
      subtotal: detalle.subtotal
    }));

  return {
    items,
    total: items.reduce((sum, i) => sum + i.subtotal, 0),
itemCount: items.reduce(
  (total, item) => total + item.quantity,
  0
)  };
}

  inicializarCarrito(usuarioId: number): Observable<ICarritoBackend> {
    return this.http.post<ICarritoBackend>(
      `${this.API}/carritos/usuarios/${usuarioId}`, {}
    ).pipe(
      tap(backend => {
        this.carritoId = backend.id;
        this.refrescarCarrito();
      })
    );
  }

  refrescarCarrito(): void {
    if (!this.carritoId) return;
    this.http.get<ICarritoBackend>(
      `${this.API}/carritos/${this.carritoId}`
    ).subscribe(backend => {
      this.cartSubject.next(this.mapearCarrito(backend));
    });
  }

  addToCart(product: IProduct, cantidad: number = 1): void {
    if (!this.carritoId) return;
    const body: IDetalleCarritoRequest = { productoId: product.id, cantidad };
    this.http.post(`${this.API}/carritos/${this.carritoId}/productos`, body)
      .subscribe(() => this.refrescarCarrito());
  }

  removeFromCart(detalleId: number): void {
    this.http.delete(`${this.API}/carrito-detalles/${detalleId}`)
      .subscribe(() => this.refrescarCarrito());
  }

  aumentar(detalleId: number): void {
    this.http.put(`${this.API}/carrito-detalles/${detalleId}/aumentar`, {})
      .subscribe(() => this.refrescarCarrito());
  }

  disminuir(detalleId: number): void {
    this.http.put(`${this.API}/carrito-detalles/${detalleId}/disminuir`, {})
      .subscribe(() => this.refrescarCarrito());
  }

  limpiarLocal(): void {
    this.carritoId = null;
    this.cartSubject.next({ items: [], total: 0, itemCount: 0 });
  }

  clearCart(): void {
    this.limpiarLocal();
  }

  getCartSnapshot(): ICart {
    return this.cartSubject.value;
  }

  getCarritoId(): number | null {
    return this.carritoId;
  }
}