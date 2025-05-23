import { inject } from '@angular/core';
import { of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const canAccessAppGuard = () => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated) {
    return of(true);
  }

  return of(false);
};
