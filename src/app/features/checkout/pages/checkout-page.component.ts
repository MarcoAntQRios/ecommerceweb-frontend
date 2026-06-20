import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { IVentaRequest } from '../../../core/models/venta.model';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right" />

    <div class="page-wrapper">

      <!-- BACK -->
      <button class="back-btn" (click)="goBack()">
        <i class="pi pi-arrow-left"></i>
        <span>Volver al carrito</span>
      </button>

      <!-- HEADER -->
      <header class="page-header">
        <h1 class="page-title">
          <i class="pi pi-credit-card"></i>
          Finalizar compra
        </h1>
        <p class="page-subtitle">Revisa tu pedido antes de continuar al pago</p>
      </header>

      <!-- EMPTY STATE -->
      <div *ngIf="((cart$ | async)?.items?.length ?? 0) === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos antes de continuar con el pago.</p>
        <p-button label="Ver productos" icon="pi pi-arrow-left"
                  severity="secondary" [outlined]="true" (onClick)="goToProducts()" />
      </div>

      <!-- CONTENT -->
      <div *ngIf="((cart$ | async)?.items?.length ?? 0) > 0" class="checkout-grid">

        <!-- COLUMNA IZQUIERDA: PASOS -->
        <div class="steps-col">

          <!-- PASO 2: PRODUCTOS -->
          <section class="panel">
            <div class="panel-header">
              <h3>Productos en tu pedido</h3>
              <p-tag [value]="((cart$ | async)?.itemCount ?? 0) + ' artículos'" severity="info" />
            </div>

            <div class="product-list">
              <div class="product-row" *ngFor="let item of (cart$ | async)?.items">
                <img [src]="item.product.imagen || 'assets/no-image.png'"
                     [alt]="item.product.nombre" class="product-thumb"
                     (error)="onImageError($event)" />
                <div class="product-meta">
                  <span class="product-name">{{ item.product.nombre }}</span>
                  <span class="product-qty">Cantidad: {{ item.quantity }} &times; S/ {{ item.product.precio | number:'1.2-2' }}</span>
                </div>
                <span class="product-subtotal">S/ {{ item.subtotal | number:'1.2-2' }}</span>
              </div>
            </div>
          </section>

          <!-- PASO 3: PAGO -->
          <section class="panel">
            <div class="panel-header">
              <h3>Método de pago</h3>
            </div>
            <div class="payment-info">
              <div class="payment-badge">
                <i class="pi pi-shield"></i>
                <div>
                  <span class="payment-title">Pago seguro con Stripe</span>
                  <span class="payment-desc">Al confirmar, serás redirigido a Stripe para completar el pago en un entorno cifrado. ProducTec no almacena los datos de tu tarjeta.</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- COLUMNA DERECHA: RESUMEN -->
        <div class="summary-col">
          <div class="summary-card">
            <h3 class="summary-title">Resumen del pedido</h3>

            <div class="summary-rows">
              <div class="summary-row">
                <span>Subtotal ({{ (cart$ | async)?.itemCount }} artículos)</span>
                <span>S/ {{ ((cart$ | async)?.total ?? 0) | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row">
                <span>Envío</span>
                <span class="free-tag">Gratis</span>
              </div>
            </div>

            <div class="summary-total">
              <span>Total</span>
              <span class="total-amount">S/ {{ ((cart$ | async)?.total ?? 0) | number:'1.2-2' }}</span>
            </div>

            <p-button
              label="Confirmar y pagar"
              icon="pi pi-lock"
              styleClass="confirm-btn"
              [loading]="loading"
              (onClick)="confirmOrder()" />

            <p class="secure-note">
              <i class="pi pi-lock"></i>
              Conexión segura y cifrada
            </p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ─────────────────────────────────────────
       PAGE
    ───────────────────────────────────────── */
    .page-wrapper {
      max-width: 1080px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-gray);
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.4rem 0;
      margin-bottom: 1.5rem;
      transition: color var(--transition-fast);
    }
    .back-btn:hover { color: var(--primary); }
    .back-btn .pi { font-size: 0.85rem; }

    .page-header {
      margin-bottom: 2rem;
    }
    .page-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--text-dark);
      margin: 0 0 0.4rem 0;
    }
    .page-title .pi {
      color: var(--primary);
      font-size: 1.5rem;
    }
    .page-subtitle {
      color: var(--text-gray);
      font-size: 0.95rem;
      margin: 0;
    }

    /* ─────────────────────────────────────────
       GRID
    ───────────────────────────────────────── */
    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2.5rem;
      align-items: start;
    }

    .steps-col {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ─────────────────────────────────────────
       PANEL (cada paso)
    ───────────────────────────────────────── */
    .panel {
      background: var(--bg-white);
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      padding: 1.5rem;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .panel-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-dark);
      margin: 0;
      flex: 1;
    }
    .step-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #eef2ff;
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    /* ─────────────────────────────────────────
       PASO 1 — CUENTA
    ───────────────────────────────────────── */
    .account-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-light);
      border-radius: 12px;
      padding: 1rem 1.25rem;
    }
    .account-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      flex-shrink: 0;
    }
    .account-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .account-name {
      font-weight: 600;
      color: var(--text-dark);
      font-size: 0.95rem;
    }
    .account-email {
      color: var(--text-gray);
      font-size: 0.85rem;
    }

    /* ─────────────────────────────────────────
       PASO 2 — PRODUCTOS
    ───────────────────────────────────────── */
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .product-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    .product-row:last-child { border-bottom: none; padding-bottom: 0; }
    .product-thumb {
      width: 56px;
      height: 56px;
      object-fit: contain;
      background: var(--bg-light);
      border-radius: 10px;
      padding: 0.4rem;
      flex-shrink: 0;
    }
    .product-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .product-name {
      font-weight: 600;
      color: var(--text-dark);
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .product-qty {
      color: var(--text-gray);
      font-size: 0.8rem;
      margin-top: 0.15rem;
    }
    .product-subtotal {
      font-weight: 700;
      color: var(--text-dark);
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    /* ─────────────────────────────────────────
       PASO 3 — PAGO
    ───────────────────────────────────────── */
    .payment-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .payment-badge {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 1rem 1.1rem;
    }
    .payment-badge .pi {
      color: var(--success);
      font-size: 1.1rem;
      margin-top: 0.15rem;
      flex-shrink: 0;
    }
    .payment-title {
      display: block;
      font-weight: 600;
      color: var(--text-dark);
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }
    .payment-desc {
      color: var(--text-gray);
      font-size: 0.82rem;
      line-height: 1.5;
    }

    /* ─────────────────────────────────────────
       RESUMEN (sticky)
    ───────────────────────────────────────── */
    .summary-col {
      position: sticky;
      top: 1.5rem;
      align-self: start;
    }
    .summary-card {
      background: var(--bg-white);
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      padding: 1.5rem;
    }
    .summary-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-dark);
      margin: 0 0 1.25rem 0;
    }
    .summary-rows {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      color: var(--text-gray);
    }
    .free-tag {
      color: var(--success);
      font-weight: 600;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }
    .summary-total span:first-child {
      font-size: 0.95rem;
      color: var(--text-dark);
    }
    .total-amount {
      font-size: 1.6rem;
      color: var(--primary);
    }

    :host ::ng-deep .confirm-btn.p-button {
      width: 100%;
      justify-content: center;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
    }

    .secure-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      color: var(--text-light);
      font-size: 0.78rem;
      margin: 0.9rem 0 0 0;
    }
    .secure-note .pi { font-size: 0.75rem; }

    /* ─────────────────────────────────────────
       EMPTY STATE
    ───────────────────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 2rem;
      text-align: center;
      min-height: 360px;
      background: var(--bg-white);
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      color: var(--text-gray);
    }
    .empty-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #eef2ff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    .empty-icon-wrap .pi {
      font-size: 2rem;
      color: var(--primary);
    }
    .empty-state h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-dark);
      margin: 0;
    }
    .empty-state p {
      margin: 0;
      color: var(--text-gray);
    }

    /* ─────────────────────────────────────────
       RESPONSIVE
    ───────────────────────────────────────── */
    @media (max-width: 900px) {
      .checkout-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .summary-col { position: static; }
    }
    @media (max-width: 768px) {
      .page-wrapper { padding: 1.25rem 1rem 3rem; }
      .page-title { font-size: 1.4rem; }
      .total-amount { font-size: 1.4rem; }
    }
  `]
})
export class CheckoutPageComponent {
  cart$;
  loading = false;

  constructor(
    private cartService: CartService,
    private ventaService: VentaService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  get usuario() {
    return this.authService.currentUser();
  }

  get initials(): string {
    const nombre = this.usuario?.nombre ?? '';
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() ?? '')
      .join('');
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sin+imagen';
  }

  confirmOrder(): void {
    const cartSnapshot = this.cartService.getCartSnapshot();

    if (cartSnapshot.items.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito vacío',
        detail: 'Agrega productos antes de continuar.',
        life: 3000
      });
      return;
    }

    const usuario = this.authService.currentUser();
    if (!usuario?.sub) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Inicia sesión',
        detail: 'Debes iniciar sesión para realizar una compra.',
        life: 3000
      });
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    const order: IVentaRequest = {
      usuarioId: Number(usuario.sub),
      detalles: cartSnapshot.items.map(item => ({
        productoId: item.product.id,
        cantidad: item.quantity
      }))
    };

    this.ventaService.createVenta(order).subscribe({
      next: (venta) => {
        this.loading = false;
        this.cartService.clearCart();
        window.location.href = venta.urlCheckout; // ← redirige a Stripe
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al procesar el pedido',
          detail: error?.message ?? 'Intenta nuevamente en unos segundos.',
          life: 4000
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}