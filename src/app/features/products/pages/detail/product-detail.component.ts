import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { IProduct } from '../../../../core/models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule, SkeletonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right" />

    <!-- ── SKELETON ── -->
    <div *ngIf="loading" class="page-wrapper">
      <div class="skeleton-back"></div>
      <div class="detail-grid">
        <p-skeleton height="460px" borderRadius="16px" />
        <div class="skeleton-info">
          <p-skeleton width="140px" height="28px" borderRadius="20px" />
          <p-skeleton width="75%" height="40px" />
          <p-skeleton width="100%" height="64px" />
          <p-skeleton width="180px" height="56px" />
          <p-skeleton width="100%" height="1px" />
          <p-skeleton width="100%" height="56px" />
          <p-skeleton width="100%" height="56px" />
        </div>
      </div>
    </div>

    <!-- ── ERROR ── -->
    <div *ngIf="error && !loading" class="empty-state">
      <div class="empty-icon-wrap">
        <i class="pi pi-exclamation-triangle"></i>
      </div>
      <h3>No se pudo cargar el producto</h3>
      <p>Intenta nuevamente o vuelve al listado.</p>
      <p-button label="Volver al listado" icon="pi pi-arrow-left"
                severity="secondary" (onClick)="goBack()" />
    </div>

    <!-- ── CONTENIDO ── -->
    <div *ngIf="product && !loading" class="page-wrapper">

      <!-- BACK -->
      <button class="back-btn" (click)="goBack()">
        <i class="pi pi-arrow-left"></i>
        <span>Volver</span>
      </button>

      <div class="detail-grid">

        <!-- COLUMNA IZQUIERDA: IMAGEN -->
        <div class="image-col">
          <div class="image-card">
            <span class="stock-pill" [ngClass]="stockClass">
              <i class="pi" [ngClass]="stockIcon"></i>
              {{ stockLabel }}
            </span>
            <img [src]="product.imagen" [alt]="product.nombre"
                 class="product-img" (error)="onImageError($event)" />
          </div>
        </div>

        <!-- COLUMNA DERECHA: INFO -->
        <div class="info-col">

          <!-- BLOQUE 1: IDENTIFICACIÓN -->
          <section class="info-block">
            <div class="tags-row">
              <p-tag [value]="product.categoriaNombre" severity="info" />
              <p-tag [value]="product.tipoNombre" severity="secondary" />
            </div>
            <h1 class="product-name">{{ product.nombre }}</h1>
            <p class="product-desc">{{ product.descripcion }}</p>
          </section>

          <!-- BLOQUE 2: PRECIO -->
          <section class="info-block price-block">
            <span class="price-label">Precio unitario</span>
            <div class="price-row">
              <span class="price-currency">S/</span>
              <span class="price-amount">{{ product.precio | number:'1.2-2' }}</span>
            </div>
          </section>

          <!-- BLOQUE 3: STOCK -->
          <section class="info-block">
            <div class="stock-row" [ngClass]="stockClass">
              <i class="pi" [ngClass]="stockIcon"></i>
              <span *ngIf="product.stock === 0">Sin stock disponible</span>
              <span *ngIf="product.stock > 0 && product.stock < 5">
                Solo quedan <strong>{{ product.stock }}</strong> unidades
              </span>
              <span *ngIf="product.stock >= 5">
                <strong>{{ product.stock }}</strong> unidades disponibles
              </span>
            </div>
          </section>

          <!-- BLOQUE 4: CANTIDAD + ACCIÓN -->
          <section class="info-block action-block" *ngIf="product.stock > 0">
  <div class="qty-row">
    <span class="qty-label">Cantidad</span>
    <div class="qty-control">
      <button class="qty-btn" (click)="decrement()" [disabled]="quantity() <= 1">
        <i class="pi pi-minus"></i>
      </button>
      <span class="qty-num">{{ quantity() }}</span>
      <button class="qty-btn" (click)="increment()" [disabled]="quantity() >= product.stock">
        <i class="pi pi-plus"></i>
      </button>
    </div>
  </div>

  <div class="subtotal-row" *ngIf="quantity() > 1">
    <span class="subtotal-label">Subtotal</span>
    <span class="subtotal-value">S/ {{ subtotal() | number:'1.2-2' }}</span>
  </div>

  <div class="action-buttons">
    <p-button
      label="Agregar al carrito"
      icon="pi pi-shopping-cart"
      styleClass="add-btn outlined-btn"
      [outlined]="true"
      [loading]="adding"
      (onClick)="addToCart()"
    />
    <p-button
      label="Comprar ahora"
      icon="pi pi-bolt"
      styleClass="add-btn buy-btn"
      (onClick)="comprarAhora()"
    />
  </div>
</section>

          <!-- SIN STOCK -->
          <section class="info-block" *ngIf="product.stock === 0">
            <p-button
              label="Ver otros productos"
              icon="pi pi-arrow-right"
              iconPos="right"
              severity="secondary"
              [outlined]="true"
              (onClick)="goBack()"
            />
          </section>

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

    /* ─────────────────────────────────────────
       BACK BUTTON
    ───────────────────────────────────────── */
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
      margin-bottom: 2rem;
      transition: color var(--transition-fast);
    }
    .back-btn:hover { color: var(--primary); }
    .back-btn .pi { font-size: 0.85rem; }

    /* ─────────────────────────────────────────
       GRID
    ───────────────────────────────────────── */
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    /* ─────────────────────────────────────────
       IMAGEN
    ───────────────────────────────────────── */
    .image-card {
      position: relative;
      background: var(--bg-light);
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .product-img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: contain;
      padding: 2rem;
      display: block;
    }
    .stock-pill {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0.3rem 0.85rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      z-index: 2;
    }

    /* ─────────────────────────────────────────
       INFO COLUMNA
    ───────────────────────────────────────── */
    .info-col {
      display: flex;
      flex-direction: column;
      gap: 0;           /* bloques se separan con border */
    }

    /* cada sección tiene su propio espacio y separador */
    .info-block {
      padding: 1.75rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    .info-block:first-child { padding-top: 0; }
    .info-block:last-child  { border-bottom: none; padding-bottom: 0; }

    /* ─────────────────────────────────────────
       BLOQUE 1 — IDENTIFICACIÓN
    ───────────────────────────────────────── */
    .tags-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .product-name {
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--text-dark);
      margin: 0 0 0.75rem 0;
      line-height: 1.25;
    }
    .product-desc {
      color: var(--text-gray);
      font-size: 1rem;
      line-height: 1.75;
      margin: 0;
    }

    /* ─────────────────────────────────────────
       BLOQUE 2 — PRECIO
    ───────────────────────────────────────── */
    .price-block {
      background: #f8f9ff;
      border-radius: 12px;
      padding: 1.25rem 1.5rem !important;
      border: 1px solid #e8eaff !important;
      margin: 1.75rem 0;
    }
    .price-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-gray);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.4rem;
    }
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 0.3rem;
    }
    .price-currency {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
    }
    .price-amount {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }

    /* ─────────────────────────────────────────
       BLOQUE 3 — STOCK
    ───────────────────────────────────────── */
    .stock-row {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      width: fit-content;
    }
    .stock-ok      { background: #d4edda; color: #155724; }
    .stock-warning { background: #fff3cd; color: #856404; }
    .stock-danger  { background: #f8d7da; color: #721c24; }
    .stock-pill.stock-ok      { background: #d4edda; color: #155724; }
    .stock-pill.stock-warning { background: #fff3cd; color: #856404; }
    .stock-pill.stock-danger  { background: #f8d7da; color: #721c24; }

    /* ─────────────────────────────────────────
       BLOQUE 4 — CANTIDAD + ACCIÓN
    ───────────────────────────────────────── */
    .action-block {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .qty-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .qty-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-dark);
      min-width: 72px;
    }
    .qty-control {
      display: flex;
      align-items: center;
      border: 1.5px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
    }
    .qty-btn {
      background: var(--bg-light);
      border: none;
      width: 44px;
      height: 44px;
      cursor: pointer;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--transition-fast);
      font-size: 0.8rem;
    }
    .qty-btn:hover:not(:disabled) { background: #e2e6ea; }
    .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .qty-num {
      min-width: 54px;
      text-align: center;
      font-weight: 700;
      font-size: 1.05rem;
      border-left: 1.5px solid var(--border-color);
      border-right: 1.5px solid var(--border-color);
      height: 44px;
      line-height: 44px;
    }

    .subtotal-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-light);
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }
    .subtotal-label {
      font-size: 0.85rem;
      color: var(--text-gray);
      font-weight: 500;
    }
    .subtotal-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    :host ::ng-deep .add-btn.p-button {
      width: 100%;
      justify-content: center;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
    }

    /* ─────────────────────────────────────────
       SKELETON
    ───────────────────────────────────────── */
    .skeleton-back {
      width: 80px;
      height: 20px;
      background: #e9ecef;
      border-radius: 4px;
      margin-bottom: 2rem;
    }
    .skeleton-info {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* ─────────────────────────────────────────
       ERROR
    ───────────────────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 2rem;
      text-align: center;
      min-height: 400px;
      color: var(--text-gray);
    }
    .empty-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #fff3cd;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    .empty-icon-wrap .pi {
      font-size: 2rem;
      color: #856404;
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
    @media (max-width: 768px) {
      .page-wrapper { padding: 1.25rem 1rem 3rem; }
      .detail-grid  { grid-template-columns: 1fr; gap: 2rem; }
      .product-name { font-size: 1.4rem; }
      .price-amount { font-size: 1.9rem; }
      .price-block  { margin: 1.25rem 0; }
    }
      .action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

:host ::ng-deep .outlined-btn.p-button {
  width: 100%;
  justify-content: center;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
}

:host ::ng-deep .buy-btn.p-button {
  width: 100%;
  justify-content: center;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  background: #2563eb;
  border-color: #2563eb;
}
:host ::ng-deep .buy-btn.p-button:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}
  .image-col {
  position: sticky;
  top: 1.5rem;
  align-self: start;
}

.info-block {
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--border-color);
}
.info-block:first-child { padding-top: 0; }
.info-block:last-child  { border-bottom: none; padding-bottom: 0; }

.price-block {
  background: #f8f9ff;
  border-radius: 12px;
  padding: 1.1rem 1.5rem !important;
  border: 1px solid #e8eaff !important;
  margin: 1.1rem 0;
}

.action-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .page-wrapper { padding: 1.25rem 1rem 3rem; }
  .detail-grid  { grid-template-columns: 1fr; gap: 2rem; }
  .image-col    { position: static; }
  .product-name { font-size: 1.4rem; }
  .price-amount { font-size: 1.9rem; }
  .price-block  { margin: 1.1rem 0; }
}
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: IProduct | null = null;
  loading = false;
  error = false;
  adding = false;

  quantity = signal(1);
  subtotal = computed(() => this.product ? this.product.precio * this.quantity() : 0);

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => this.loadProduct(+params['id']));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = false;
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => { this.product = p; this.loading = false; },
        error: () => { this.error = true; this.loading = false; }
      });
  }

  get stockClass(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'stock-danger';
    if (this.product.stock < 5) return 'stock-warning';
    return 'stock-ok';
  }

  get stockIcon(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'pi-times-circle';
    if (this.product.stock < 5) return 'pi-exclamation-triangle';
    return 'pi-check-circle';
  }

  get stockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Sin stock';
    if (this.product.stock < 5) return 'Últimas unidades';
    return 'En stock';
  }

  increment(): void {
    if (this.product && this.quantity() < this.product.stock)
      this.quantity.update(q => q + 1);
  }

  decrement(): void {
    if (this.quantity() > 1) this.quantity.update(q => q - 1);
  }

  addToCart(): void {
    if (!this.product) return;
    this.adding = true;
    this.cartService.addToCart(this.product, this.quantity());
    setTimeout(() => {
      this.adding = false;
      this.quantity.set(1);
      this.messageService.add({
        severity: 'success',
        summary: 'Agregado',
        detail: `${this.product!.nombre} añadido al carrito`,
        life: 3000
      });
    }, 500);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Sin+imagen';
  }

  goBack(): void {
    window.history.back();
  }
  comprarAhora(): void {
  if (!this.product) return;
  this.cartService.addToCart(this.product, this.quantity());
  this.router.navigate(['/checkout']);
}
}