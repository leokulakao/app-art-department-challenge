import { inject } from '@angular/core';
import { catchError, from, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const canAccessAppGuard = () => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated) {
    return of(true);
  }

  return from(authService.login()).pipe(
    map(() => {
      console.log('User logged in successfully');
      return true;
    }),
    catchError(() => {
      console.error('Error logging in user');
      return of(false);
    })
  );
};
