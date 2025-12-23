import { Routes } from '@angular/router';

export const SPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../space/page/space-list-page')
        .then(m => m.SpacesListPage)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../space/page/form/space-form-page')
        .then(m => m.SpaceFormPage)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../space/page/form/space-form-page')
        .then(m => m.SpaceFormPage)
  }
];
