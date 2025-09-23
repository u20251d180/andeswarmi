import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Recovery } from './pages/recovery/recovery';
import { Register } from './pages/register/register';

export const routes: Routes = [
    
    {path : 'login', component: Login},
    {path : 'home', component: Home},
    {path : 'recover-password', component: Recovery},
    {path : 'register', component: Register},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
