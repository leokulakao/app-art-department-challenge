import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { VotesStore } from '../../common/signal-store/votes.store';
import { VotingArticlesStore } from '../../common/signal-store/voting-articles.store';

@Component({
  selector: 'app-voting-article',
  template: `
    <div class="page">
      <header class="header">
        <div class="app-title__block">
          <h2 class="app-title__item">Art Department Challenge</h2>
        </div>
      </header>
      @if (votingArticleStore.paramVotingArticle(); as votingArticle) {
        <main class="container">
          <div class="candidate-title">
            <p>{{ votingArticle.title }}</p>
            <p>{{ votingArticle.vote_criteria }}</p>
          </div>

          <div class="candidate-container">
            @for (item of votingArticle.candidatePhotoViews; track $index) {
              <div class="candidate__item">
                <img
                  class="candidate__img"
                  [src]="item.candidatePhotoUrl"
                  alt="Image" />
                @if (showVoteButton()) {
                  <button
                    class="button button--vote"
                    (click)="onVote(votingArticle.id, item.candidatePhotoId)">
                    Votar
                  </button>
                } @else if (item.isVoted) {
                  <button
                    class="button button--vote"
                    (click)="onVote(votingArticle.id, item.candidatePhotoId)"
                    disabled>
                    Votado
                  </button>
                }
              </div>
            }
          </div>
        </main>
      }

      <footer class="navigation">
        <button class="button" (click)="onBack()">Atras</button>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingArticleComponent {
  protected votingArticleStore = inject(VotingArticlesStore);
  protected votesStore = inject(VotesStore);
  private router = inject(Router);

  protected readonly showVoteButton = computed(() =>
    this.votingArticleStore
      .paramVotingArticle()
      ?.candidatePhotoViews.find(
        votingArticle => votingArticle.isVoted === true
      )
      ? false
      : true
  );

  protected onBack() {
    this.router.navigate(['/voting']);
  }

  protected onVote(votingArticleId: number, candidatePhotoId: string) {
    this.votesStore.vote({ votingArticleId, candidatePhotoId });
  }
}
