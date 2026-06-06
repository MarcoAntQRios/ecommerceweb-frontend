import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
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
  template: `
    <div class="products-admin">
      <h2>Gestión de Productos</h2>

      <p-button label="Nuevo Producto" icon="pi pi-plus" (click)="openDialog()" class="mb-3"></p-button>

      <p-table [value]="products" [rows]="10" [paginator]="true" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
            <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
            <th pSortableColumn="descripcion">Descripción <p-sortIcon field="descripcion"></p-sortIcon></th>
            <th pSortableColumn="precio">Precio <p-sortIcon field="precio"></p-sortIcon></th>
            <th pSortableColumn="stock">Stock <p-sortIcon field="stock"></p-sortIcon></th>
            <th pSortableColumn="tipoNombre">Tipo <p-sortIcon field="tipoNombre"></p-sortIcon></th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.id }}</td>
            <td>{{ product.nombre }}</td>
            <td>{{ product.descripcion }}</td>
            <td>S/ {{ product.precio }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.tipoNombre }}</td>
            <td>
              <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" (click)="editProduct(product)"></p-button>
              <p-button icon="pi pi-box" [rounded]="true" [text]="true" severity="warn" (click)="openStockDialog(product)"></p-button>
              <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (click)="deleteProduct(product.id)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Dialog Crear/Editar -->
      <p-dialog [(visible)]="displayDialog" [header]="dialogTitle" [modal]="true" [style]="{width: '50vw'}">
        <div class="form-group">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="selectedProduct.nombre" class="form-control" />
        </div>
        <div class="form-group">
          <label>Descripción:</label>
          <textarea [(ngModel)]="selectedProduct.descripcion" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Precio:</label>
          <input type="number" [(ngModel)]="selectedProduct.precio" class="form-control" />
        </div>
        <div class="form-group">
          <label>Imagen (URL):</label>
          <input type="text" [(ngModel)]="selectedProduct.imagen" class="form-control" placeholder="https://..." />
          <img *ngIf="selectedProduct.imagen" [src]="selectedProduct.imagen" class="preview-img" />
        </div>
        <div class="form-group" *ngIf="!isEditMode">
          <label>Stock inicial:</label>
          <input type="number" [(ngModel)]="selectedProduct.stock" class="form-control" />
        </div>
        <div class="form-group">
          <label>Tipo:</label>
          <select [(ngModel)]="selectedProduct.tipoId" class="form-control">
            <option [ngValue]="null" disabled>Selecciona un tipo</option>
            <option *ngFor="let tipo of tipos" [ngValue]="tipo.id">{{ tipo.nombre }}</option>
          </select>
        </div>
        <div class="dialog-footer">
          <p-button label="Cancelar" [text]="true" severity="secondary" (click)="displayDialog = false"></p-button>
          <p-button label="Guardar" icon="pi pi-check" (click)="saveProduct()"></p-button>
        </div>
      </p-dialog>

      <!-- Dialog Stock -->
      <p-dialog [(visible)]="displayStockDialog" header="Actualizar Stock" [modal]="true" [style]="{width: '30vw'}">
        <p>Producto: <strong>{{ selectedProduct.nombre }}</strong></p>
        <p>Stock actual: <strong>{{ selectedProduct.stock }}</strong></p>
        <div class="form-group" style="margin-top: 1rem">
          <label>Nuevo Stock:</label>
          <input type="number" [(ngModel)]="nuevoStock" class="form-control" />
        </div>
        <div class="dialog-footer">
          <p-button label="Cancelar" [text]="true" severity="secondary" (click)="displayStockDialog = false"></p-button>
          <p-button label="Actualizar" icon="pi pi-check" severity="warn" (click)="saveStock()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .products-admin { max-width: 1200px; }
    h2 { margin-bottom: 2rem; }
    .mb-3 { margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
    textarea.form-control { resize: vertical; }
    .preview-img { width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px; margin-top: 0.5rem; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }
  `]
})
export class ProductsAdminComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  tipos: { id: number, nombre: string }[] = [];
  displayDialog = false;
  displayStockDialog = false;
  selectedProduct: Partial<IProduct> & { tipoId?: number } = {};
  dialogTitle = 'Nuevo Producto';
  isEditMode = false;
  nuevoStock = 0;
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadTipos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => this.products = products);
  }

  loadTipos(): void {
    this.apiService.getTipos()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipos => this.tipos = tipos);
  }

  openDialog(): void {
    this.selectedProduct = {};
    this.dialogTitle = 'Nuevo Producto';
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editProduct(product: IProduct): void {
    this.selectedProduct = { ...product };
    this.dialogTitle = 'Editar Producto';
    this.isEditMode = true;
    this.displayDialog = true;
  }

  openStockDialog(product: IProduct): void {
    this.selectedProduct = { ...product };
    this.nuevoStock = product.stock;
    this.displayStockDialog = true;
  }

  saveProduct(): void {
    if (this.isEditMode) {
      const { stock, tipoNombre, ...productoSinStock } = this.selectedProduct as any;
      this.apiService.updateProduct(this.selectedProduct.id!, productoSinStock)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.displayDialog = false;
          this.loadProducts();
        });
    } else {
      this.apiService.createProduct(this.selectedProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.displayDialog = false;
          this.loadProducts();
        });
    }
  }

  saveStock(): void {
    this.apiService.actualizarStock(this.selectedProduct.id!, this.nuevoStock)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.displayStockDialog = false;
        this.loadProducts();
      });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.apiService.deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadProducts());
    }
  }
}