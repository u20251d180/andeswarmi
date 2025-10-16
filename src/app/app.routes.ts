// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './core/auth/auth.guard';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
   { path: 'account', component: AccountComponent },

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
{
  path: 'password-recovery',
  loadComponent: () =>
    import('./pages/password-recovery/password-recovery').then(
      (m) => m.PasswordRecovery
    )
},
{ path: '**', redirectTo: '' }

];
