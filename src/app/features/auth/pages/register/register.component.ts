import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUsuarioRequest } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgButtonModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>🛒 Crear Cuenta</h2>
        <p class="subtitle">Únete y empieza a comprar</p>

        <div class="form-group">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="usuario.nombre" class="form-control" placeholder="Tu nombre" />
        </div>
        <div class="form-group">
          <label>Apellido:</label>
          <input type="text" [(ngModel)]="usuario.apellido" class="form-control" placeholder="Tu apellido" />
        </div>
        <div class="form-group">
          <label>Correo:</label>
          <input type="email" [(ngModel)]="usuario.correo" class="form-control" placeholder="correo@ejemplo.com" />
        </div>
        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" [(ngModel)]="usuario.password" class="form-control" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Teléfono:</label>
          <input type="text" [(ngModel)]="usuario.telefono" class="form-control" placeholder="999 999 999" />
        </div>
        <div class="form-group">
          <label>Dirección:</label>
          <input type="text" [(ngModel)]="usuario.direccion" class="form-control" placeholder="Tu dirección" />
        </div>

        <div *ngIf="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div *ngIf="successMsg" class="success-msg">{{ successMsg }}</div>

        <div class="form-footer">
          <p-button 
            label="Registrarse" 
            icon="pi pi-user-plus" 
            [loading]="loading"
            (click)="register()">
          </p-button>
        </div>

        <p class="login-link">
          ¿Ya tienes cuenta? <a (click)="goToProducts()" class="link">Ir a productos</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 2rem;
    }
    .register-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 480px;
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      text-align: center;
    }
    .subtitle {
      text-align: center;
      color: #999;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
      color: #555;
    }
    .form-control {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }
    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }
    .error-msg {
      background: #f8d7da;
      color: #842029;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      text-align: center;
    }
    .success-msg {
      background: #d1e7dd;
      color: #0f5132;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      text-align: center;
    }
    .form-footer {
      margin-top: 1.5rem;
      width: 100%;
    }
    .form-footer p-button {
      width: 100%;
    }
    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #666;
      font-size: 0.9rem;
    }
    .link {
      color: #007bff;
      cursor: pointer;
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  usuario: IUsuarioRequest = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
    rolId: 0
  };
  loading = false;
  errorMsg = '';
  successMsg = '';
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void { this.setRolCliente(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setRolCliente(): void {
    this.apiService.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(roles => {
        const rolCliente = roles.find(r => r.nombre.toLowerCase() === 'cliente');
        if (rolCliente) this.usuario.rolId = rolCliente.id;
      });
  }

  register(): void {
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.password) {
      this.errorMsg = 'Nombre, correo y contraseña son obligatorios.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.apiService.createUsuario(this.usuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMsg = '¡Cuenta creada exitosamente!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/products']), 1500);
        },
        error: () => {
          this.errorMsg = 'Error al crear la cuenta. Intenta de nuevo.';
          this.loading = false;
        }
      });
  }

  goToProducts(): void { this.router.navigate(['/products']); }
}