import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CartService } from '../../../../core/services/cart.service';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgButtonModule],
  template: `
    <div class="products-container">
      <h2>📦 Catálogo de Productos</h2>

      <div *ngIf="loading" class="loading">Cargando productos...</div>

      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card">

          <div class="stock-badge" [ngClass]="{
            'sin-stock': product.stock === 0,
            'poco-stock': product.stock > 0 && product.stock < 5,
            'en-stock': product.stock >= 5
          }">
            {{ product.stock === 0 ? 'Sin stock' : product.stock < 5 ? 'Últimas unidades' : 'En stock' }}
          </div>

          <a [routerLink]="['/products', product.id]">
            <img [src]="product.imagen" [alt]="product.nombre" class="product-image"
              (error)="onImageError($event)" />
          </a>

          <div class="product-info">
            <h3>{{ product.nombre }}</h3>
            <p class="description">{{ product.descripcion }}</p>

            <div class="price-section">
              <span class="price">S/ {{ product.precio | number:'1.0-0' }}</span>
              <span class="stock-text">
                {{ product.stock === 0 ? 'Sin stock' : product.stock < 5 ? 'Últimas unidades' : 'Disponible' }}
              </span>
            </div>

            <div class="buttons-section">
              <p-button
                label="Agregar al Carrito"
                icon="pi pi-shopping-cart"
                (click)="addToCart(product)"
                [disabled]="product.stock === 0">
              </p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem;
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s, box-shadow 0.3s;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .stock-badge {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      z-index: 1;
    }

    .sin-stock { background: #f8d7da; color: #842029; }
    .poco-stock { background: #fff3cd; color: #856404; }
    .en-stock { background: #d1e7dd; color: #0f5132; }

    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .product-image:hover {
      opacity: 0.9;
    }

    .product-info {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }

    .description {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .price-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f0f0f0;
    }

    .price {
      font-size: 1.4rem;
      font-weight: 700;
      color: #007bff;
    }

    .stock-text {
      font-size: 0.8rem;
      color: #999;
    }

    .buttons-section {
      margin-top: 0.75rem;
    }

    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.loading = false;
        }
      });
  }

  addToCart(product: IProduct): void {
    this.cartService.addToCart(product, 1);
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/300x200?text=Sin+Imagen';
  }
}