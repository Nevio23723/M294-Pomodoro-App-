import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard]
    },
    {
        path: 'timer/:duration',
        loadComponent: () => import('./pages/timer/timer').then(m => m.Timer),
        canActivate: [authGuard]
    },
    {
        path: 'excuse',
        loadComponent: () => import('./pages/excuse/excuse.component').then(m => m.ExcuseComponent),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '/login' }
];
