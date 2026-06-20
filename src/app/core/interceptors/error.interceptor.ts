import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', error);

      if (error.status === 401) {
        localStorage.removeItem('auth_token');
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        router.navigate(['/home']);
      }

      // Se relanza el HttpErrorResponse original para que cada
      // componente pueda leer error.status y error.error.mensaje
      return throwError(() => error);
    })
  );
};