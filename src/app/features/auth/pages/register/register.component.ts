import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
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

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void { this.setRolCliente(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setRolCliente(): void {
    this.usuarioService.getRoles()
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
    this.usuarioService.createUsuario(this.usuario)
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