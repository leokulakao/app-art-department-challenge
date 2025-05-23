import {
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, provideRouter, Routes } from '@angular/router';

import { AppComponent } from './app/app.component';
import { canAccessAppGuard } from './app/common/guards/can-access-app.guard';
import { AuthService } from './app/common/services/auth.service';
import { SupabaseService } from './app/common/services/supabase.service';
import { VotesStore } from './app/common/signal-store/votes.store';
import { VotingArticlesStore } from './app/common/signal-store/voting-articles.store';
import { LoginComponent } from './app/features/login/login.component';
import { ManagerComponent } from './app/features/manager/manager.component';
import { loadPhotoStorageGuard } from './app/features/voting/guard/load-photo-storage.guard';
import { loadVotesGuard } from './app/features/voting/guard/load-votes.guard';
import { loadVotingArticlesGuard } from './app/features/voting/guard/load-voting-articles.guard';
import { VotingArticleComponent } from './app/features/voting/voting-article.component';
import { VotingComponent } from './app/features/voting/voting.component';

export const routes: Routes = [
  {
    path: '',
    providers: [SupabaseService, AuthService, VotesStore, VotingArticlesStore],
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'voting',
        canActivate: [
          canAccessAppGuard,
          loadVotingArticlesGuard,
          loadPhotoStorageGuard,
          loadVotesGuard,
        ],
        children: [
          { path: '', component: VotingComponent },
          {
            path: 'item/:votingArticleId',
            component: VotingArticleComponent,
            resolve: {
              loader: (snapshot: ActivatedRouteSnapshot) => {
                const votingArticleStore = inject(VotingArticlesStore);
                votingArticleStore.setVotingArticleId(snapshot);
                return true;
              },
            },
          },
          {
            path: 'manager',
            providers: [ManagerComponent],
            component: ManagerComponent,
          },
        ],
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
