import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VentaService } from '../../../core/services/venta.service';

@Component({
  selector: 'app-checkout-cancel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cancel-wrapper">
      <div class="cancel-card">

        <ng-container *ngIf="loading">
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Procesando cancelación...</p>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading && !error">
          <div class="cancel-icon">
            <svg viewBox="0 0 52 52" width="80" height="80">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#dc2626" stroke-width="2"
                stroke-dasharray="166" stroke-dashoffset="166"
                style="animation: stroke 0.6s cubic-bezier(0.65,0,0.45,1) forwards"/>
              <line x1="16" y1="16" x2="36" y2="36" stroke="#dc2626" stroke-width="2.5"
                stroke-linecap="round"
                stroke-dasharray="30" stroke-dashoffset="30"
                style="animation: stroke 0.3s cubic-bezier(0.65,0,0.45,1) 0.5s forwards"/>
              <line x1="36" y1="16" x2="16" y2="36" stroke="#dc2626" stroke-width="2.5"
                stroke-linecap="round"
                stroke-dasharray="30" stroke-dashoffset="30"
                style="animation: stroke 0.3s cubic-bezier(0.65,0,0.45,1) 0.6s forwards"/>
            </svg>
          </div>

          <h1>Pago cancelado</h1>
          <p class="subtitle">Cancelaste el proceso de pago. Tu orden quedó registrada como cancelada.</p>

          <div class="order-details" *ngIf="ventaId">
            <div class="detail-item">
              <span class="label">NÚMERO DE ORDEN</span>
              <span class="value order-id">ORD-{{ ventaId }}</span>
            </div>
            <div class="detail-divider"></div>
            <div class="detail-item">
              <span class="label">ESTADO</span>
              <span class="badge-cancel">CANCELADO</span>
            </div>
          </div>

          <div class="divider"></div>
          <p class="hint">Puedes volver a realizar tu compra cuando quieras.</p>

          <div class="actions">
            <button class="btn btn-outline" routerLink="/mis-compras">
              Ver mis pedidos
            </button>
            <button class="btn btn-primary" routerLink="/products">
              Volver a la tienda
            </button>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading && error">
          <div class="error-icon">✕</div>
          <h1 class="error-title">Error</h1>
          <p class="error-msg">{{ error }}</p>
          <button class="btn btn-outline" routerLink="/home">Volver al inicio</button>
        </ng-container>

      </div>
    </div>
  `,
  styles: [`
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    @keyframes spin    { to   { transform: rotate(360deg); } }

    .cancel-wrapper {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f8fafc;
    }
    .cancel-card {
      background: white;
      border-radius: 20px;
      padding: 3rem 2.5rem 2.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
    }
    .cancel-icon { margin: 0 auto 1.5rem; }
    h1 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem; }
    .subtitle { color: #64748b; font-size: 0.95rem; margin: 0 0 1.75rem; }

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
    .detail-item { display: flex; flex-direction: column; align-items: flex-start; gap: 0.3rem; }
    .detail-divider { width: 1px; height: 36px; background: #e2e8f0; }
    .label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
    .order-id { font-family: monospace; }
    .badge-cancel {
      background: #fee2e2;
      color: #dc2626;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.7rem;
      border-radius: 999px;
      letter-spacing: 0.03em;
    }

    .divider { height: 1px; background: #e2e8f0; margin: 0 0 1.25rem; }
    .hint { color: #94a3b8; font-size: 0.82rem; margin: 0 0 1.5rem; line-height: 1.5; }

    .actions { display: flex; gap: 0.75rem; justify-content: center; }
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
    .btn-outline  { background: #f1f5f9; color: #475569; }
    .btn-outline:hover  { background: #e2e8f0; }
    .btn-primary  { background: #1e3a8a; color: white; }
    .btn-primary:hover  { background: #1e40af; }

    .loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem 0; color: #64748b; }
    .spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #1e3a8a; border-radius: 50%; animation: spin 0.8s linear infinite; }

    .error-icon { width: 60px; height: 60px; border-radius: 50%; background: #fee2e2; color: #dc2626; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .error-title { color: #dc2626; }
    .error-msg { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }
  `]
})
export class CheckoutCancelComponent implements OnInit {
  loading = true;
  error: string | null = null;
  ventaId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['ventaId'];

    if (!id) {
      this.router.navigate(['/home']);
      return;
    }

    this.ventaId = Number(id);

    this.ventaService.cancelarPago(this.ventaId).subscribe({
      next: () => { this.loading = false; },
      error: () => {
        // Si ya estaba cancelado o procesado, igual mostramos la pantalla
        this.loading = false;
      }
    });
  }
}