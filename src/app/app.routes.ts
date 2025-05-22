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
        path: 'register',
        loadComponent: () => import('./core/auth/components/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'products',
        loadComponent: () => import('./shared/components/products-horizontal-list/products-horizontal-list.component').then(m => m.ProductsHorizontalListComponent),
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
