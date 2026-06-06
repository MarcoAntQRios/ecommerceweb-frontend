import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IVenta } from '../../../../core/models/venta.model';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule],
  template: `
    <div class="orders-admin">
      <h2>Gestión de Ventas</h2>

      <p-table [value]="ventas" [rows]="10" [paginator]="true" responsiveLayout="scroll">
        <ng-template #header>
          <tr>
            <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
            <th pSortableColumn="usuarioNombre">Usuario <p-sortIcon field="usuarioNombre" /></th>
            <th pSortableColumn="fecha">Fecha <p-sortIcon field="fecha" /></th>
            <th pSortableColumn="total">Total <p-sortIcon field="total" /></th>
            <th pSortableColumn="estado">Estado <p-sortIcon field="estado" /></th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template #body let-venta>
          <tr>
            <td>{{ venta.id }}</td>
            <td>{{ venta.usuarioNombre }}</td>
            <td>{{ venta.fecha | date:'short' }}</td>
            <td>S/ {{ venta.total }}</td>
            <td><span [ngClass]="'estado-' + venta.estado.toLowerCase()">{{ venta.estado }}</span></td>
            <td>
              <p-button icon="pi pi-eye" [rounded]="true" [text]="true" (click)="verVenta(venta)" />
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="displayDialog" header="Detalle de Venta" [modal]="true" [style]="{width: '50vw'}">
        @if (selectedVenta) {
          <div class="venta-detail">
            <p><strong>ID:</strong> {{ selectedVenta.id }}</p>
            <p><strong>Usuario:</strong> {{ selectedVenta.usuarioNombre }}</p>
            <p><strong>Fecha:</strong> {{ selectedVenta.fecha | date:'medium' }}</p>
            <p><strong>Estado:</strong> {{ selectedVenta.estado }}</p>
            <p><strong>Total:</strong> S/ {{ selectedVenta.total }}</p>

            <h4 style="margin-top: 1rem">Productos:</h4>
            <table class="detalle-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                @for (detalle of selectedVenta.detalleVenta; track detalle.productoId) {
                  <tr>
                    <td>{{ detalle.productoNombre }}</td>
                    <td>{{ detalle.cantidad }}</td>
                    <td>S/ {{ detalle.precio }}</td>
                    <td>S/ {{ detalle.subtotal }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="dialog-footer">
            <p-button label="Cerrar" icon="pi pi-times" (click)="displayDialog = false" />
          </div>
        }
      </p-dialog>
    </div>
  `,
  styles: [`
    .orders-admin { max-width: 1200px; padding: 1rem; }
    h2 { margin-bottom: 1.5rem; }
    .estado-pendiente { background: #fff3cd; color: #856404; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem; font-weight: 600; }
    .estado-procesado { background: #d1e7dd; color: #0f5132; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem; font-weight: 600; }
    .estado-cancelado { background: #f8d7da; color: #842029; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem; font-weight: 600; }
    .venta-detail p { margin: 0.5rem 0; color: #555; }
    .detalle-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
    .detalle-table th { background: #f8f9fa; padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd; }
    .detalle-table td { padding: 0.75rem; border-bottom: 1px solid #eee; }
    .dialog-footer { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
  `]
})
export class OrdersAdminComponent implements OnInit, OnDestroy {
  ventas: IVenta[] = [];
  displayDialog = false;
  selectedVenta: IVenta | null = null;
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { this.loadVentas(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVentas(): void {
    this.apiService.getVentas()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ventas: IVenta[]) => this.ventas = ventas);
  }

  verVenta(venta: IVenta): void {
    this.selectedVenta = venta;
    this.displayDialog = true;
  }
}