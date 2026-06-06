import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CartService } from '../../../../core/services/cart.service';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from '../../../../core/models/product.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-detail',

  standalone: true,

  imports: [

    CommonModule,

    RouterModule,

    PrimeNgButtonModule,

    FormsModule

  ],
  template: `
    <div *ngIf="product" class="product-detail">
  <button pButton type="button" icon="pi pi-arrow-left" (click)="goBack()" class="p-button-text"></button>

  <div class="detail-grid">
    <div class="image-section">
      <img [src]="product.imagen" [alt]="product.nombre" class="product-image" />
    </div>

    <div class="info-section">
      <h1>{{ product.nombre }}</h1>
      <p class="description">{{ product.descripcion }}</p>

      <div class="details">
        <p><strong>Categoría:</strong> {{ product.tipoNombre }}</p>
        <p><strong>Stock:</strong> {{ product.stock }} unidades</p>
      </div>

      <div class="purchase-section">
        <div class="price-section">
          <span class="price">S/ {{ product.precio }}</span>
        </div>

        <div class="quantity-section">
          <label>Cantidad:</label>
          <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock" />
        </div>

        <p-button
          label="Agregar al Carrito"
          icon="pi pi-shopping-cart"
          (click)="addToCart()"
          [disabled]="product.stock === 0 || quantity <= 0">
        </p-button>
      </div>
    </div>
  </div>
</div>

<div *ngIf="loading" class="loading">
  <p>Cargando...</p>
</div>
  `,
  styles: [`
    .product-detail {
      max-width: 1200px;
      margin: 0 auto;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-top: 2rem;
    }

    .image-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .product-image {
      width: 100%;
      max-width: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 2rem;
      color: #333;
      margin: 0 0 1rem 0;
    }

    .description {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .details {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .details p {
      margin: 0.5rem 0;
      color: #555;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }

    .purchase-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .quantity-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .quantity-section input {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .price {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: IProduct | null = null;
  quantity = 1;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.loadProduct(params['id']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.apiService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar producto:', error);
          this.loading = false;
        }
      });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.quantity = 1;
    }
  }

  goBack(): void {
    window.history.back();
  }
  
}