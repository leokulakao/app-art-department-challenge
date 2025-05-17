import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';

import { AppComponent } from './app/app.component';
import { canAccessAppGuard } from './app/common/guards/can-access-app.guard';
import { AuthService } from './app/common/services/auth.service';
import { SupabaseService } from './app/common/services/supabase.service';
import { ManagerComponent } from './app/features/manager/manager.component';
import { VotingComponent } from './app/features/voting/voting.component';
import { VotingService } from './app/features/voting/voting.service';

export const routes: Routes = [
  {
    path: '',
    providers: [SupabaseService, AuthService],
    canActivate: [canAccessAppGuard],
    children: [
      {
        path: '',
        providers: [VotingService],
        component: VotingComponent,
      },
      {
        path: 'manager',
        component: ManagerComponent,
      },
    ],
  },

  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
  ],
}).catch(err => console.error(err));
