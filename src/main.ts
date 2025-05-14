import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';

import { AppComponent } from './app/app.component';
import { SupabaseService } from './app/common/services/supabase.service';
import { ManagerComponent } from './app/features/manager/manager.component';
import { OverviewComponent } from './app/features/overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    providers: [SupabaseService],
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
