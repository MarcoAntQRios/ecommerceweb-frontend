import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { VentaService } from '../../core/services/venta.service';
import { AuthService } from '../../core/services/auth.service';
import { IVenta } from '../../core/models/venta.model';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './mis-compras.component.html',
  styleUrls: ['./mis-compras.component.css']
})
export class MisComprasComponent implements OnInit {
  ventas: IVenta[] = [];
  loading = true;
  ventaSeleccionada: IVenta | null = null;
  clienteNombre = '';
  descargando: number | null = null;

  constructor(
    private ventaService: VentaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  const userId = Number(this.authService.currentUser()?.sub);
  if (!userId) { this.loading = false; return; }

  this.ventaService.getVentasPorUsuario(userId).subscribe({
    next: (data) => {
      this.ventas = data.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      this.loading = false;
    },
    error: () => { this.loading = false; }
  });
}

  abrirModal(venta: IVenta): void {
    this.ventaSeleccionada = venta;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.ventaSeleccionada = null;
    document.body.style.overflow = '';
  }

  descargarComprobante(ventaId: number): void {
    if (this.descargando === ventaId) return;
    this.descargando = ventaId;

    this.ventaService.descargarComprobante(ventaId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante-${ventaId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.descargando = null;
      },
      error: () => { this.descargando = null; }
    });
  }

}