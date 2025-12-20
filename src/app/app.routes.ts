import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.routes)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'reservations',
    loadChildren: () =>
      import('./reservations/reservations.routes').then(m => m.RESERVATION_ROUTES)
  }
];
