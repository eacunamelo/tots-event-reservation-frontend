import { Routes } from '@angular/router';

export const RESERVATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reservations-page/reservations-page')
        .then(m => m.ReservationsPage)
  },
  {
    path: 'new/:spaceId',
    loadComponent: () =>
      import('./pages/form/reservation-form-page')
        .then(m => m.ReservationFormPage)
  }
];
