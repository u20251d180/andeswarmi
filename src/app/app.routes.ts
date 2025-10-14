// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'recover-password',
    loadComponent: () => import('./pages/recovery/recovery').then(m => m.Recovery)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.Orders),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminDashboard),
    canActivate: [AdminGuard]
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/products/product-detail/product-detail').then(
        m => m.ProductDetail
      )
  },
  { path: '**', redirectTo: '' }
];
