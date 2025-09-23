import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
    {path : 'login', component: Login},
    {path : 'home', component: Landing}
];
