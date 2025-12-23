import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login-page/login-page')
        .then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../auth/pages/register-page/register-page')
        .then(m => m.RegisterPage)
  }
];
