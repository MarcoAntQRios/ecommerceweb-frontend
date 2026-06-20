import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsuario, IUsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly API_BASE = 'http://localhost:8060/api';

  constructor(private http: HttpClient) {}

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


  
  getRoles(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<{ id: number; nombre: string }[]>(`${this.API_BASE}/roles`);
  }
}