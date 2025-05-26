import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../common/services/auth.service';
import { SupabaseService } from '../../common/services/supabase.service';
import { VotingArticlesStore } from '../../common/signal-store/voting-articles.store';

@Component({
  selector: 'app-voting',
  template: `
    <div class="page">
      <main class="articles">
        <div class="container">
          <div class="articles__header">
            <h1>Art Department Challenge</h1>
          </div>

          <div class="articles__list">
            @for (
              votingArticle of votingArticlesStore.votingArticlesWithPhoto();
              track $index
            ) {
              <div class="article__item">
                <a
                  class="article__link"
                  [routerLink]="'item/' + votingArticle.id">
                  <img
                    class="article__img"
                    [src]="votingArticle.mainPhotoUrl"
                    alt="Image" />
                  <span class="article__title">{{ votingArticle.title }}</span>
                </a>
              </div>
            }
          </div>
        </div>
      </main>
      <footer class="navigation">
        @if (votingArticlesStore.allArticleAreVoted()) {
          <button class="button" (click)="onSend()">Enviar resultados</button>
        }
      </footer>
    </div>
  `,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly supabaseClient = inject(SupabaseService).supabaseClient;
  protected readonly votingArticlesStore = inject(VotingArticlesStore);

  protected onSend() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
