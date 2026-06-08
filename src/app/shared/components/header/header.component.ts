import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PrimeNgMenuModule } from '../../modules/primeng-menu.module';
import { PrimeNgButtonModule } from '../../modules/primeng-button.module';
import { CartService } from '../../../core/services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgMenuModule, PrimeNgButtonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>🛒 E-Commerce</h1>
        </div>

       <nav class="nav">
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
  <a routerLink="/products" routerLinkActive="active" class="nav-link">Productos</a>
</nav>
        <div class="actions-section">
          <p-button
  label="Registrarse"
  icon="pi pi-user-plus"
  [text]="true"
  severity="secondary"
  (click)="goToRegister()">
</p-button>
          <p-button
            icon="pi pi-shopping-cart"
            [rounded]="true"
            [text]="true"
            (click)="showCart()"
            [badge]="((cart$ | async)?.itemCount ?? 0).toString()"
            badgeStyleClass="p-badge-danger">
          </p-button>
        </div>
      </div>
    </header>

    <p-drawer
      [(visible)]="sidebarVisible"
      position="right"
      styleClass="cart-sidebar"
      [modal]="true"
      [showCloseIcon]="true">
      <ng-template pTemplate="header">
        <h3>🛒 Carrito ({{ (cart$ | async)?.itemCount }} items)</h3>
      </ng-template>

      <div class="cart-items-container">
        <div *ngIf="((cart$ | async)?.items?.length ?? 0) === 0" class="empty-cart">
          <p>Tu carrito está vacío</p>
        </div>

        <div *ngFor="let item of (cart$ | async)?.items" class="cart-item">
          <img [src]="item.product.imagen" [alt]="item.product.nombre" />
          <div class="item-details">
            <p class="item-name">{{ item.product.nombre }}</p>
            <p class="item-price">S/ {{ item.product.precio }}</p>
            <div class="quantity-controls">
              <button (click)="decreaseQuantity(item.product.id)">-</button>
              <span>{{ item.quantity }}</span>
              <button (click)="increaseQuantity(item.product.id)">+</button>
            </div>
          </div>
          <button class="remove-btn" (click)="removeItem(item.product.id)">×</button>
        </div>
      </div>

      <ng-template pTemplate="footer" *ngIf="((cart$ | async)?.items?.length ?? 0) > 0">
        <div class="cart-footer">
          <p class="total">Total: S/ {{ (cart$ | async)?.total }}</p>
          <p-button
            label="Checkout"
            icon="pi pi-check"
            class="w-full"
            (click)="goToCheckout()">
          </p-button>
        </div>
      </ng-template>
    </p-drawer>
  `,
  styles: [`
    .header {
      background: #fff;
      border-bottom: 2px solid #f0f0f0;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    .nav {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }
    .nav-link {
      text-decoration: none;
      color: #555;
      font-weight: 500;
      transition: color 0.3s;
      padding: 0.5rem 0;
      border-bottom: 2px solid transparent;
    }
    .nav-link:hover,
    .nav-link.active {
      color: #007bff;
      border-bottom-color: #007bff;
    }
    .actions-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cart-items-container {
      max-height: 60vh;
      overflow-y: auto;
    }
    .empty-cart {
      text-align: center;
      padding: 2rem;
      color: #999;
    }
    .cart-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      align-items: flex-start;
    }
    .cart-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
    .item-details { flex: 1; }
    .item-name {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #333;
    }
    .item-price {
      margin: 0 0 0.5rem 0;
      color: #007bff;
      font-weight: bold;
    }
    .quantity-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      border: 1px solid #ddd;
      width: fit-content;
      border-radius: 4px;
    }
    .quantity-controls button {
      padding: 0.25rem 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: bold;
      width: 30px;
    }
    .quantity-controls button:hover { background: #f0f0f0; }
    .remove-btn {
      background: #ff4444;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
    }
    .remove-btn:hover { background: #cc0000; }
    .cart-footer {
      padding: 1rem;
      border-top: 1px solid #eee;
    }
    .total {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-align: right;
    }
    .w-full { width: 100%; }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  sidebarVisible = false;
  cart$;
  private destroy$ = new Subject<void>();

  constructor(
    public cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$.pipe(takeUntil(this.destroy$));
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showCart(): void { this.sidebarVisible = true; }

  goToRegister(): void { this.router.navigate(['/register']); }

  increaseQuantity(productId: number): void {
    const cart = this.cartService.getCartSnapshot();
    const item = cart.items.find(i => i.product.id === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity + 1);
  }

  decreaseQuantity(productId: number): void {
    const cart = this.cartService.getCartSnapshot();
    const item = cart.items.find(i => i.product.id === productId);
    if (item && item.quantity > 1) this.cartService.updateQuantity(productId, item.quantity - 1);
  }

  removeItem(productId: number): void { this.cartService.removeFromCart(productId); }

  goToCheckout(): void {
    this.sidebarVisible = false;
    this.router.navigate(['/checkout']);
  }
}