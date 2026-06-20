import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILoginRequest, ILoginResponse, IJwtPayload } from '../models/auth.model';
import { CartService } from './cart.service';
import { IUsuarioRequest } from '../models/usuario.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly LOGIN_URL = 'http://localhost:8060/auth/login';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REGISTER_URL = 'http://localhost:8060/auth/registrar';


  private _isLoggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  isLoggedIn = this._isLoggedIn.asReadonly();

  currentUser = computed<IJwtPayload | null>(() => {
    if (!this._isLoggedIn()) return null;
    return this.decodeToken(this.getToken());
  });

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {
    // si ya hay token al iniciar (refresh), inicializa el carrito
    const token = this.getToken();
    if (token) {
      const user = this.decodeToken(token);
      if (user?.sub) {
        this.cartService.inicializarCarrito(Number(user.sub)).subscribe();
      }
    }
  }
register(data: IUsuarioRequest): Observable<any> {
  return this.http.post(this.REGISTER_URL, data);
}
  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.LOGIN_URL, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        this._isLoggedIn.set(true);
        const user = this.decodeToken(response.accessToken);
        if (user?.sub) {
          this.cartService.inicializarCarrito(Number(user.sub)).subscribe();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isLoggedIn.set(false);
    this.cartService.limpiarLocal();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  
  isAdmin(): boolean {
    const roles = this.currentUser()?.roles ?? [];
    return roles.some(r => r.replace(/^ROLE_/i, '').toUpperCase() === 'ADMIN');
  }

  private decodeToken(token: string | null): IJwtPayload | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
  
}