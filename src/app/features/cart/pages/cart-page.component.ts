import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PrimeNgButtonModule } from '../../../shared/modules/primeng-button.module';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgButtonModule],
  template: `
    <div class="cart-page">
      <h2>🛒 Mi Carrito</h2>

      <div *ngIf="(cart$ | async)?.items?.length === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <h3>Tu carrito está vacío</h3>
        <p>Explora nuestros productos y encuentra lo que necesitas.</p>

        <p-button
          label="Continuar comprando"
          icon="pi pi-arrow-left"
          (click)="goToProducts()">
        </p-button>
      </div>

      <div *ngIf="((cart$ | async)?.items?.length ?? 0) > 0" class="cart-content">

        <div class="cart-items">

          <div
            class="cart-item"
            *ngFor="let item of (cart$ | async)?.items">

            <div class="product-info">

              <img
                [src]="item.product.imagen || 'assets/no-image.png'"
                [alt]="item.product.nombre"
                class="product-image">

              <div class="product-details">
                <h4>{{ item.product.nombre }}</h4>

                <span class="price">
                  S/ {{ item.product.precio.toFixed(2) }}
                </span>
              </div>

            </div>

            <div class="quantity-controls">

              <button
                class="qty-btn"
                (click)="decreaseQuantity(item.detalleId)">
                -
              </button>

              <span class="qty">
                {{ item.quantity }}
              </span>

              <button
                class="qty-btn"
                (click)="increaseQuantity(item.detalleId)">
                +
              </button>

            </div>

            <div class="subtotal">
              S/ {{ item.subtotal.toFixed(2) }}
            </div>

            <button
              class="delete-btn"
              (click)="removeItem(item.detalleId)">
              <i class="pi pi-trash"></i>
            </button>

          </div>

        </div>

        <div class="cart-summary">

          <h3>Resumen del Pedido</h3>

          <div class="summary-row">
            <span>Productos</span>
            <span>{{ (cart$ | async)?.itemCount }}</span>
          </div>

          <div class="summary-row total-row">
            <span>Total</span>
            <span>
              S/ {{ ((cart$ | async)?.total ?? 0).toFixed(2) }}
            </span>
          </div>

          <p-button
            label="Proceder al Pago"
            icon="pi pi-credit-card"
            styleClass="w-full"
            (click)="goToCheckout()">
          </p-button>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      margin-bottom: 2rem;
      color: #111827;
      font-size: 2rem;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,.08);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-cart h3 {
      margin-bottom: .5rem;
    }

    .empty-cart p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
      align-items: start;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      align-items: center;
      gap: 1.5rem;
      background: white;
      padding: 1rem;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,.08);
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .product-image {
      width: 90px;
      height: 90px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .product-details h4 {
      margin: 0;
      font-size: 1rem;
      color: #111827;
    }

    .price {
      display: block;
      margin-top: .5rem;
      color: #2563eb;
      font-weight: 600;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .qty-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: #f3f4f6;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      transition: .2s;
    }

    .qty-btn:hover {
      background: #2563eb;
      color: white;
    }

    .qty {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
    }

    .subtotal {
      font-size: 1.1rem;
      font-weight: 700;
      color: #111827;
      min-width: 100px;
      text-align: right;
    }

    .delete-btn {
      border: none;
      background: transparent;
      color: #ef4444;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .cart-summary {
      background: white;
      padding: 1.5rem;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,.08);
      position: sticky;
      top: 20px;
    }

    .cart-summary h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      color: #4b5563;
    }

    .total-row {
      font-size: 1.2rem;
      font-weight: bold;
      color: #111827;
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 1fr;
      }

      .subtotal {
        text-align: left;
      }
    }
  `]
})
export class CartPageComponent {

  cart$;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  increaseQuantity(detalleId: number): void {
    this.cartService.aumentar(detalleId);
  }

  decreaseQuantity(detalleId: number): void {
    this.cartService.disminuir(detalleId);
  }

  removeItem(detalleId: number): void {
    this.cartService.removeFromCart(detalleId);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}