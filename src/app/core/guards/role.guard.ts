import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as string[] | undefined) || [];
  const user = await authService.ensureCurrentUserProfile(true);

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (!roles.length || roles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
