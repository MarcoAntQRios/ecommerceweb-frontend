import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { ApiService } from '../../../core/services/api.service';
import { PrimeNgButtonModule } from '../../../shared/modules/primeng-button.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgButtonModule],
  template: `
    <div class="checkout-page">
      <h2>💳 Checkout</h2>

      <div class="checkout-content">
        <div class="form-section">
          <h3>Información de Envío</h3>
          <div class="form-group">
            <label>Nombre Completo:</label>
            <input type="text" [(ngModel)]="formData.name" />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" [(ngModel)]="formData.email" />
          </div>
          <div class="form-group">
            <label>Dirección:</label>
            <input type="text" [(ngModel)]="formData.address" />
          </div>
        </div>

        <div class="summary-section">
          <h3>Resumen del Pedido</h3>
          <div *ngFor="let item of (cart$ | async)?.items" class="order-item">
            <span>{{ item.product.nombre }} x {{ item.quantity }}</span>
            <span>\${{ item.subtotal }}</span>
          </div>
          <div class="order-total">
            <strong>Total:</strong>
            <strong>\${{ ((cart$ | async)?.total ?? 0).toFixed(2) }}</strong>
          </div>

          <p-button
            label="Confirmar Pedido"
            icon="pi pi-check"
            (click)="confirmOrder()"
            [loading]="loading">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
      max-width: 1000px;
      margin: 0 auto;
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .form-section h3,
    .summary-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .summary-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #ddd;
    }

    .order-total {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      margin-top: 1rem;
      font-size: 1.1rem;
      color: #007bff;
    }
  `]
})
export class CheckoutPageComponent {
  cart$;
  loading = false;
  formData = {
    name: '',
    email: '',
    address: ''
  };

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  confirmOrder(): void {
    this.loading = true;
    const cartSnapshot = this.cartService.getCartSnapshot();

    const order = {
      user: {
        name: this.formData.name,
        email: this.formData.email
      },
      address: this.formData.address,
      items: cartSnapshot.items,
      total: cartSnapshot.total,
      status: 'pending'
    };

this.apiService.createVenta(order as any).subscribe({
          next: () => {
        this.loading = false;
        this.cartService.clearCart();
        alert('¡Orden creada exitosamente!');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.loading = false;
        alert('Error al crear la orden: ' + error.message);
      }
    });
  }
}