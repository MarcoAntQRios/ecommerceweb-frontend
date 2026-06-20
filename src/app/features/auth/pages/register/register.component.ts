import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUsuarioRequest } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgButtonModule],
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnDestroy {
  usuario: IUsuarioRequest = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
    rolId: 1
  };

  loading = false;
  errorMsg = '';
  successMsg = '';
  passwordVisible = false;

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  register(): void {
  const campos = {
    nombre: this.usuario.nombre,
    apellido: this.usuario.apellido,
    correo: this.usuario.correo,
    password: this.usuario.password,
    telefono: this.usuario.telefono,
    direccion: this.usuario.direccion
  };

  const hayCampoVacio = Object.values(campos).some(
    valor => !valor || !valor.toString().trim()
  );

  if (hayCampoVacio) {
    this.errorMsg = 'Todos los campos son obligatorios.';
    return;
  }

  this.loading = true;
  this.errorMsg = '';

  this.authService.register(this.usuario)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.successMsg = '¡Cuenta creada exitosamente!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error?.mensaje) {
          this.errorMsg = err.error.mensaje;
        } else if (err.status === 409) {
          this.errorMsg = 'Ya existe una cuenta registrada con ese correo electrónico.';
        } else {
          this.errorMsg = 'Error al crear la cuenta. Intenta de nuevo.';
        }
        this.loading = false;
      }
    });
}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}