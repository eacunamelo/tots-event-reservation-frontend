import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'spaces',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'spaces',
    loadChildren: () =>
      import('./space/space.routes').then(m => m.SPACE_ROUTES)
  },
  {
    path: 'reservations',
    loadChildren: () =>
      import('./reservations/reservations.routes').then(m => m.RESERVATION_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'spaces'
  }
];
