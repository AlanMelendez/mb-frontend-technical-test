import { Routes } from '@angular/router';
import AuthComponent from './core/auth/auth.component';
import { authGuard } from './core/guards/auth-external.guard';

export const routes: Routes = [

    {
        path: 'auth',
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.AuthRoutes)
    },
    {
        path: 'login',
        loadComponent: () => import('./core/auth/components/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
