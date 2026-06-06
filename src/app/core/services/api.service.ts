import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product.model';
import { IVenta, IVentaRequest } from '../models/venta.model';
import { IUsuario, IUsuarioRequest } from '../models/usuario.model';
@Injectable({ providedIn: 'root' })
export class ApiService {
  // ⚠️ CAMBIAR ESTA URL POR LA URL DE TU BACKEND
  private readonly API_BASE = 'http://localhost:8060/api';

  constructor(private http: HttpClient) { }

  // ============= PRODUCTOS =============
 getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.API_BASE}/productos`);
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.API_BASE}/productos/${id}`);
  }

  getProductsByTipo(nombre: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.API_BASE}/productos/tipo/${nombre}`);
  }

  createProduct(product: Partial<IProduct>): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.API_BASE}/productos`, product);
  }

  updateProduct(id: number, product: Partial<IProduct>): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.API_BASE}/productos/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/productos/${id}`);
  }
  actualizarStock(id: number, stock: number): Observable<IProduct> {
  return this.http.put<IProduct>(`${this.API_BASE}/productos/${id}/stock`, null, {
    params: { stock: stock.toString() }
  });
}
  // ============= PRODUCTO TIPOS =============
getTipos(): Observable<{id: number, nombre: string}[]> {
  return this.http.get<{id: number, nombre: string}[]>(`${this.API_BASE}/producto-tipos`);
}
// ============= USUARIOS =============

getUsuarios(): Observable<IUsuario[]> {
  return this.http.get<IUsuario[]>(`${this.API_BASE}/usuarios`);
}

getUsuarioById(id: number): Observable<IUsuario> {
  return this.http.get<IUsuario>(`${this.API_BASE}/usuarios/${id}`);
}

createUsuario(usuario: IUsuarioRequest): Observable<IUsuario> {
  return this.http.post<IUsuario>(`${this.API_BASE}/usuarios`, usuario);
}

updateUsuario(id: number, usuario: IUsuarioRequest): Observable<IUsuario> {
  return this.http.put<IUsuario>(`${this.API_BASE}/usuarios/${id}`, usuario);
}
// ============= VENTAS =============
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
// ============= ROLES =============
getRoles(): Observable<{id: number, nombre: string}[]> {
  return this.http.get<{id: number, nombre: string}[]>(`${this.API_BASE}/roles`);
}
}