import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { PrimeNgTableModule } from '../../../../shared/modules/primeng-table.module';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { PrimeNgDialogModule } from '../../../../shared/modules/primeng-dialog.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgTableModule, PrimeNgButtonModule, PrimeNgDialogModule],
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsAdminComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  tipos: { id: number, nombre: string }[] = [];
  categorias: { id: number, nombre: string }[] = [];
  tiposFiltrados: { id: number, nombre: string }[] = [];
  displayDialog = false;
  displayStockDialog = false;
  selectedProduct: Partial<IProduct> & { tipoId?: number, categoriaId?: number } = {};
  dialogTitle = 'Nuevo Producto';
  isEditMode = false;
  nuevoStock = 0;
  private destroy$ = new Subject<void>();

  private tiposPorCategoria: Record<string, string[]> = {
  'Pc':          ['Gaming', 'Estudio', 'Oficina', 'Edicion'],
  'Laptop':      ['Gaming', 'Estudio', 'Oficina', 'Edicion'],
  'Monitores':      ['Gaming', 'Estudio', 'Oficina', 'Edicion'],
  'Perifericos': ['monitores', 'Teclado', 'Mouse', 'Audio', 'Webcam'],
  'Componentes': ['Procesadores', 'Tarjetas Graficas', 'Memorias Ram', 'Almacenamiento', 'Placas Base'],
};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadTipos();
    this.loadCategorias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => this.products = products);
  }

  loadTipos(): void {
    this.productService.getTipos()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipos => this.tipos = tipos);
  }

  loadCategorias(): void {
    this.productService.getCategorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categorias: { id: number, nombre: string }[]) => this.categorias = categorias);
  }

  onCategoriaChange(): void {
    const catNombre = this.categorias.find(c => c.id === this.selectedProduct.categoriaId)?.nombre ?? '';
    const permitidos = this.tiposPorCategoria[catNombre] ?? [];
    this.tiposFiltrados = this.tipos.filter(t =>
      permitidos.some(p => t.nombre.toLowerCase() === p.toLowerCase())
    );
    this.selectedProduct.tipoId = undefined;
  }

  openDialog(): void {
    this.selectedProduct = {};
    this.tiposFiltrados = [];
    this.dialogTitle = 'Nuevo Producto';
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editProduct(product: IProduct): void {
    this.selectedProduct = { ...product };
    this.dialogTitle = 'Editar Producto';
    this.isEditMode = true;
    // Al editar, cargar los tipos de la categoría actual
    if ((this.selectedProduct as any).categoriaId) {
      this.onCategoriaChange();
      this.selectedProduct.tipoId = (product as any).tipoId;
    }
    this.displayDialog = true;
  }

  openStockDialog(product: IProduct): void {
    this.selectedProduct = { ...product };
    this.nuevoStock = product.stock;
    this.displayStockDialog = true;
  }

  saveProduct(): void {
    if (this.isEditMode) {
      const { stock, tipoNombre, categoriaNombre, ...productoSinStock } = this.selectedProduct as any;
      this.productService.updateProduct(this.selectedProduct.id!, productoSinStock)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.displayDialog = false;
          this.loadProducts();
        });
    } else {
      this.productService.createProduct(this.selectedProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.displayDialog = false;
          this.loadProducts();
        });
    }
  }

  saveStock(): void {
    this.productService.actualizarStock(this.selectedProduct.id!, this.nuevoStock)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.displayStockDialog = false;
        this.loadProducts();
      });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadProducts());
    }
  }
}