import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const RESERVATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reservations-page/reservations-page')
        .then(m => m.ReservationsPage),
        canActivate: [authGuard]
  },
  {
    path: 'new/:spaceId',
    loadComponent: () =>
      import('./pages/form/reservation-form-page')
        .then(m => m.ReservationFormPage),
        canActivate: [authGuard]
  }
];
