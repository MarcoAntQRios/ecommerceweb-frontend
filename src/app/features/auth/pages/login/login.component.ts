import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { ILoginRequest } from '../../../../core/models/auth.model';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgButtonModule,
    PasswordModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnDestroy {
  credentials: ILoginRequest = { email: '', password: '' };
  loading = false;
  errorMsg = '';
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  login(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMsg = 'Correo y contraseña son obligatorios.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.loading = false; this.router.navigate(['/home']); },
        error: () => { this.errorMsg = 'Correo o contraseña incorrectos.'; this.loading = false; }
      });
  }

  goToRegister(): void { this.router.navigate(['/register']); }
}