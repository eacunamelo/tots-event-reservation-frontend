import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';
import { adminGuard } from '../auth/guards/admin.guard';

export const SPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../space/page/space-list-page')
        .then(m => m.SpacesListPage)
  },
  {
    path: 'new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('../space/page/form/space-form-page')
        .then(m => m.SpaceFormPage)
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('../space/page/form/space-form-page')
        .then(m => m.SpaceFormPage)
  }
];

