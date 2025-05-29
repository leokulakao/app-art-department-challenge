import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../common/services/auth.service';
import { SupabaseService } from '../../common/services/supabase.service';
import { VotingArticlesStore } from '../../common/signal-store/voting-articles.store';
import { VotingArticleView } from '../../common/types/app.types';

@Component({
  selector: 'app-voting',
  template: `
    <div class="page">
      <main class="articles">
        <div class="container">
          <div class="articles__header">
            <h1>Art Department Challenge</h1>
            <p>Entra en cada bloque y elegi tu favorita.</p>
          </div>

          <div class="articles__list">
            @for (
              votingArticle of votingArticlesStore.votingArticlesWithPhoto();
              track $index
            ) {
              <div
                class="article__item"
                [class]="{
                  'article__item--voted': showVotedButton(votingArticle),
                }">
                <a
                  class="article__link"
                  [routerLink]="'item/' + votingArticle.id">
                  <img
                    class="article__img"
                    [src]="votingArticle.mainPhotoUrl"
                    alt="Image" />
                  <span class="article__title">{{ votingArticle.title }}</span>

                  <svg
                    class="article__done"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24">
                    <path
                      d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
                  </svg>
                </a>
              </div>
            }
          </div>
        </div>
      </main>
      <footer class="navigation">
        <div class="container">
          @if (votingArticlesStore.allArticleAreVoted()) {
            <button class="button" (click)="onSend()">Enviar resultados</button>
          }
        </div>
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

  protected showVotedButton({ candidatePhotoViews }: VotingArticleView) {
    if (Array.isArray(candidatePhotoViews)) {
      return candidatePhotoViews.find(
        votingArticle => votingArticle.isVoted === true
      )
        ? true
        : false;
    }

    return false;
  }
}
