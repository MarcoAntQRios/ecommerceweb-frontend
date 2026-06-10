import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_BASE = 'http://localhost:8060/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.API_BASE}/productos`);
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.API_BASE}/productos/${id}`);
  }

  getProductsByTipo(tipo: string, categoria?: string): Observable<IProduct[]> {
    const params: any = { tipo };
    if (categoria) params.categoria = categoria;
    return this.http.get<IProduct[]>(`${this.API_BASE}/productos/filtrar`, { params });
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


  getTipos(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<{ id: number; nombre: string }[]>(`${this.API_BASE}/producto-tipos`);
  }


  getCategorias(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<{ id: number; nombre: string }[]>(`${this.API_BASE}/categorias`);
  }
}