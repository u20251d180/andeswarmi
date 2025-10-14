import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * 🔹 AuthGuard
 * Protege rutas que requieren usuario autenticado.
 */
export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};

/**
 * 🔹 AdminGuard
 * Solo permite acceso a usuarios con rol "admin".
 */
export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin) {
    return true;
  } else {
    router.navigateByUrl('/');
    return false;
  }
};
