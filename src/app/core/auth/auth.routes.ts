import { Routes } from '@angular/router';
import AuthComponent from './auth.component';
import { guestGuard } from '../guards/auth-external.guard';

export const AuthRoutes: Routes = [
   {
    path: '',
    component: AuthComponent,
    canActivate: [guestGuard],
    children:[
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
        { path: '**', redirectTo: 'login' },
    ],
   }
];