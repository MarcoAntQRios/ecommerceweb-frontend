import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../../core/services/venta.service';
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
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.css']
})
export class OrdersAdminComponent implements OnInit, OnDestroy {
  ventas: IVenta[] = [];
  displayDialog = false;
  selectedVenta: IVenta | null = null;
  private destroy$ = new Subject<void>();

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void { this.loadVentas(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVentas(): void {
    this.ventaService.getVentas()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ventas: IVenta[]) => this.ventas = ventas);
  }

  verVenta(venta: IVenta): void {
    this.selectedVenta = venta;
    this.displayDialog = true;
  }
}