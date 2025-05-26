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
      <main class="articles">
        <div class="container">
          @if (votingArticleStore.paramVotingArticle(); as votingArticle) {
            <div class="articles__header">
              <h1>Art Department Challenge</h1>
              <h2>{{ votingArticle.title }}</h2>
              <p>{{ votingArticle.vote_criteria }}</p>
            </div>

            <div
              class="articles__list articles__list--candidates"
              [class]="{
                'articles__list--voted': showVoteButton,
              }">
              @for (item of votingArticle.candidatePhotoViews; track $index) {
                <div
                  class="candidate"
                  [class]="{ 'candidate--voted': item.isVoted }">
                  <img
                    class="candidate__img"
                    [src]="item.candidatePhotoUrl"
                    alt="Imagen" />
                  @if (showVoteButton()) {
                    <button
                      class="button button--vote"
                      (click)="onVote(votingArticle.id, item.candidatePhotoId)">
                      ¡Esta es mi favorita!
                    </button>
                  } @else if (item.isVoted) {
                    <div class="candidate__vote">
                      ¡Has seleccionado esta foto!<br />
                      ¡Gracias!
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </main>

      <footer class="navigation">
        <button class="button" (click)="onBack()">Ir al menú principal</button>
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
