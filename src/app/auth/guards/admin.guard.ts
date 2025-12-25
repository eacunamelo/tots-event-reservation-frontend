import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.hasToken()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { redirect: state.url }
    });
  }

  if (!auth.isAdmin()) {
    return router.createUrlTree(['/spaces']);
  }

  return true;
};
