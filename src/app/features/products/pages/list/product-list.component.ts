import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgButtonModule],
 templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'];
      const categoria = params['categoria'];
      this.loadProducts(tipo, categoria);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(tipo: string, categoria?: string): void {
    this.loading = true;
    this.productService.getProductsByTipo(tipo, categoria)
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