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
        <p>Tu carrito está vacío</p>
        <p-button
          label="Continuar comprando"
          icon="pi pi-arrow-left"
          (click)="goToProducts()">
        </p-button>
      </div>

  <div *ngIf="((cart$ | async)?.items?.length ?? 0) > 0" class="cart-content">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of (cart$ | async)?.items">
              <td>{{ item.product.nombre }}</td>
              <td>S/ {{ item.product.precio }}</td>
              <td>{{ item.quantity }}</td>
              <td>\${{ item.subtotal }}</td>
              <td>
                <p-button
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  (click)="removeItem(item.product.id)">
                </p-button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="cart-summary">
          <h3>Resumen del Pedido</h3>
          <p>Total: <strong>\${{ ((cart$ | async)?.total ?? 0).toFixed(2)}}</strong></p>
          <p-button
            label="Ir a Checkout"
            icon="pi pi-check"
            (click)="goToCheckout()">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      max-width: 1000px;
      margin: 0 auto;
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
    }

    .empty-cart {
      text-align: center;
      padding: 3rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .empty-cart p {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }

    .cart-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .cart-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #ddd;
    }

    .cart-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
    }

    .cart-table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .cart-summary {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .cart-summary h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .cart-summary p {
      margin: 0.5rem 0;
      color: #666;
    }

    .cart-summary p strong {
      font-size: 1.3rem;
      color: #007bff;
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

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}