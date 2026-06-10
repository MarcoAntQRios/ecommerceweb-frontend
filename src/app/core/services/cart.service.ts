import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICart, ICartItem } from '../models/cart.model';
import { IProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<ICart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    // Cargar carrito del localStorage si existe, en lugar de localstorage tiene que ser de la BD
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  addToCart(product: IProduct, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * product.precio;
    } else {
      currentCart.items.push({
        product,
        quantity,
        subtotal: product.precio * quantity
      });
    }

    this.updateCart();
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(
      item => item.product.id !== productId
    );
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(i => i.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.subtotal = quantity * item.product.precio;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartSubject.next({
      items: [],
      total: 0,
      itemCount: 0
    });
    localStorage.removeItem('cart');
  }

  private updateCart(): void {
    const currentCart = this.cartSubject.value;
    currentCart.total = currentCart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    currentCart.itemCount = currentCart.items.length;
    this.cartSubject.next(currentCart);
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
  }

  getCart(): Observable<ICart> {
    return this.cart$;
  }

  getCartSnapshot(): ICart {
    return this.cartSubject.value;
  }
}