import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVenta, IVentaRequest } from '../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly API_BASE = 'http://localhost:8060/api';

  constructor(private http: HttpClient) {}

  getVentas(): Observable<IVenta[]> {
    return this.http.get<IVenta[]>(`${this.API_BASE}/ventas`);
  }

  getVentaById(id: number): Observable<IVenta> {
    return this.http.get<IVenta>(`${this.API_BASE}/ventas/${id}`);
  }

  getVentasPorUsuario(usuarioId: number): Observable<IVenta[]> {
    return this.http.get<IVenta[]>(`${this.API_BASE}/ventas/usuario/${usuarioId}`);
  }

  createVenta(venta: IVentaRequest): Observable<IVenta> {
    return this.http.post<IVenta>(`${this.API_BASE}/ventas`, venta);
  }

  procesarPago(ventaId: number): Observable<IVenta> {
  return this.http.patch<IVenta>(
    `${this.API_BASE}/ventas/procesar-pago?ventaId=${ventaId}`,
    {}
  );
}
obtenerCheckoutUrl(ventaId: number): Observable<string> {
  return this.http.get(`${this.API_BASE}/ventas/${ventaId}/checkout-url`, { responseType: 'text' });
}
cancelarPago(ventaId: number): Observable<IVenta> {
  return this.http.patch<IVenta>(
    `${this.API_BASE}/ventas/cancelar-pago?ventaId=${ventaId}`,
    {}
  );
}
descargarComprobante(ventaId: number): Observable<Blob> {
  return this.http.get(
    `${this.API_BASE}/ventas/${ventaId}/comprobante`,
    {
      responseType: 'blob'
    }
  );
}
}