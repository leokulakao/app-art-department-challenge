import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';

import { AppComponent } from './app/app.component';
import { canAccessAppGuard } from './app/common/guards/can-access-app.guard';
import { AuthService } from './app/common/services/auth.service';
import { SupabaseService } from './app/common/services/supabase.service';
import { ManagerComponent } from './app/features/manager/manager.component';
import { OverviewComponent } from './app/features/overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    providers: [SupabaseService, AuthService],
    canActivate: [canAccessAppGuard],
    children: [
      {
        path: '',
        component: OverviewComponent,
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
