import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VentaService } from '../../../core/services/venta.service';
import { IVenta } from '../../../core/models/venta.model';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-wrapper">
      <div class="success-card">

        <ng-container *ngIf="loading">
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Procesando tu pago...</p>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading && orderData">
          <div class="success-icon">
            <svg viewBox="0 0 52 52" class="checkmark">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14 27l8 8 16-16"/>
            </svg>
          </div>

          <h1>¡Pago exitoso!</h1>
          <p class="subtitle">Tu compra fue procesada correctamente.</p>

          <div class="order-details">
            <div class="detail-item">
              <span class="label">NÚMERO DE ORDEN</span>
              <span class="value order-id">ORD-{{ orderData.id }}</span>
            </div>
            <div class="detail-divider"></div>
            <div class="detail-item">
              <span class="label">TOTAL PAGADO</span>
              <span class="value total">S/ {{ orderData.total.toFixed(2) }}</span>
            </div>
            <div class="detail-divider"></div>
            <div class="detail-item">
              <span class="label">ESTADO</span>
              <span class="badge">{{ orderData.estado }}</span>
            </div>
          </div>

          <div class="divider"></div>
          <p class="hint">Descarga tu comprobante o revisa el historial de tus pedidos.</p>

          <div class="actions">
            <button class="btn btn-outline" routerLink="/mis-compras">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              Ver mis pedidos
            </button>
            <button class="btn btn-success" (click)="descargarComprobante()" [disabled]="descargando">
              <svg *ngIf="!descargando" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <div *ngIf="descargando" class="btn-spinner"></div>
              {{ descargando ? 'Descargando...' : 'Descargar comprobante' }}
            </button>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading && error">
          <div class="error-icon">✕</div>
          <h1 class="error-title">Error al procesar el pago</h1>
          <p class="error-msg">{{ error }}</p>
          <button class="btn btn-outline" routerLink="/home">Volver al inicio</button>
        </ng-container>

      </div>
    </div>
  `,
  styles: [`
   .success-wrapper {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
}

    .success-card {
      background: white;
      border-radius: 20px;
      padding: 3rem 2.5rem 2.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.10);
    }

    /* ── Ícono animado ── */
    .success-icon {
      margin: 0 auto 1.5rem;
      width: 80px;
      height: 80px;
    }
    .checkmark { width: 80px; height: 80px; }
    .checkmark__circle {
      stroke: #16a34a;
      stroke-width: 2;
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .checkmark__check {
      stroke: #16a34a;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
    }
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }

    /* ── Títulos ── */
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.4rem;
    }
    .subtitle {
      color: #64748b;
      font-size: 0.95rem;
      margin: 0 0 1.75rem;
    }

    /* ── Detalle de orden ── */
    .order-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.75rem;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }
    .detail-divider {
      width: 1px;
      height: 36px;
      background: #e2e8f0;
    }
    .label {
      font-size: 0.65rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .value {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }
    .value.total {
      color: #16a34a;
      font-size: 1rem;
    }
    .order-id { font-family: monospace; }
    .badge {
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.7rem;
      border-radius: 999px;
      letter-spacing: 0.03em;
    }

    /* ── Divisor y hint ── */
    .divider {
      height: 1px;
      background: #e2e8f0;
      margin: 0 0 1.25rem;
    }
    .hint {
      color: #94a3b8;
      font-size: 0.82rem;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }

    /* ── Botones ── */
    .actions {
      display: flex;
      flex-direction: row;
      gap: 0.75rem;
      justify-content: center;
    }
    .btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .btn-outline {
      background: #dbeafe;
      color: #1d4ed8;
    }
    .btn-outline:hover:not(:disabled) {
      background: #bfdbfe;
    }
    .btn-success {
      background: #fee2e2;
      color: #dc2626;
    }
    .btn-success:hover:not(:disabled) {
      background: #fecaca;
      color: #b91c1c;
      transform: translateY(-1px);
    }

    /* ── Spinner del botón ── */
    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(220, 38, 38, 0.2);
      border-top-color: #dc2626;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* ── Loading state ── */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem 0;
      color: #64748b;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #1e3a8a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Error state ── */
    .error-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #fee2e2;
      color: #dc2626;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .error-title { color: #dc2626; }
    .error-msg { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
  orderData: IVenta | null = null;
  loading = true;
  error: string | null = null;
  descargando = false;

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ventaId = this.route.snapshot.queryParams['ventaId'];

    if (!ventaId) {
      this.router.navigate(['/home']);
      return;
    }

    this.ventaService.procesarPago(Number(ventaId)).subscribe({
      next: (venta) => {
        this.orderData = venta;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo confirmar el pago. Contacta soporte.';
        this.loading = false;
      }
    });
  }

  descargarComprobante(): void {
    if (!this.orderData || this.descargando) return;

    this.descargando = true;

    this.ventaService.descargarComprobante(this.orderData.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante-${this.orderData?.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.descargando = false;
      },
      error: () => {
        console.error('Error descargando comprobante');
        this.descargando = false;
      }
    });
  }
}