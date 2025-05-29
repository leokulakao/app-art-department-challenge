import { inject } from '@angular/core';
import { from, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const canAccessAppGuard = () => {
  const authService = inject(AuthService);

  return from(authService.checkUser()).pipe(
    map(isAuthenticated => (isAuthenticated ? true : false))
  );
};
