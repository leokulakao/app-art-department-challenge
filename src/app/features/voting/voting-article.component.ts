import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { VotesStore } from '../../common/signal-store/votes.store';
import { VotingArticlesStore } from '../../common/signal-store/voting-articles.store';
import { CandidatePhotoView } from '../../common/types/app.types';

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
                  <button
                    class="candidate__button"
                    (click)="
                      showItem(
                        $index,
                        votingArticle.candidatePhotoViews,
                        votingArticle.id
                      )
                    ">
                    <img
                      class="candidate__img"
                      [src]="item.candidatePhotoUrl"
                      alt="Imagen" />
                  </button>

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

        <dialog
          id="open_dialog"
          aria-labelledby="dialog_title"
          aria-describedby="dialog_description"
          [open]="isDialogSelected !== null"
          (mousedown)="onMouseDown($event)"
          (keydown)="onDialogKeydown($event)"
          tabindex="0">
          <div class="container">
            <img
              class="candidate__img"
              [src]="isDialogSelected?.candidatePhotoUrl"
              alt="Imagen" />

            <div class="flex flex-space-between">
              <button type="button" class="button--prev" (click)="goTo('prev')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  fill="currentColor">
                  <path
                    d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </button>
              <button type="button" class="button--next" (click)="goTo('next')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  fill="currentColor">
                  <path
                    d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </button>
            </div>

            <div class="flex flex-space-between">
              <button
                type="button"
                class="button--close"
                (click)="showItem(null)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24">
                  <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>

              @if (showVoteButton()) {
                <button
                  class="button button--vote"
                  (click)="
                    onVote(
                      votingArticleSelected,
                      isDialogSelected?.candidatePhotoId
                    )
                  ">
                  ¡Esta es mi favorita!
                </button>
              } @else if (isDialogSelected?.isVoted) {
                <div class="candidate__vote">
                  ¡Has seleccionado esta foto!<br />
                  ¡Gracias!
                </div>
              }
            </div>
          </div>
        </dialog>
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

  protected onVote(
    votingArticleId: number | null,
    candidatePhotoId: string | undefined
  ) {
    if (votingArticleId && typeof candidatePhotoId === 'string') {
      this.votesStore.vote({ votingArticleId, candidatePhotoId });

      if (this.isDialogSelected !== null) {
        this.isDialogSelected.isVoted = true;
      }
    }
  }

  protected isDialogSelected: CandidatePhotoView | null = null;
  protected votingArticleSelected: number | null = null;

  protected showItem(
    index: number | null,
    all: CandidatePhotoView[] = [],
    votingArticleId?: number
  ) {
    console.log('showItem', index, all);
    if (index === null) {
      this.isDialogSelected = null;
      this.votingArticleSelected = null;
      return;
    }

    this.isDialogSelected = all[index] || null;
    this.votingArticleSelected = votingArticleId || null;

    // focus the dialog after it is opened
    setTimeout(() => {
      const dialog = document.getElementById('open_dialog');

      if (dialog) {
        (dialog as HTMLElement).focus();
      }
    }, 0);
  }

  protected onMouseDown(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.isDialogSelected = null;
    }
  }

  protected goTo(direction: 'prev' | 'next' = 'prev') {
    const photoViews =
      this.votingArticleStore.paramVotingArticle()?.candidatePhotoViews || [];

    if (
      this.isDialogSelected &&
      this.votingArticleSelected &&
      photoViews.length > 0
    ) {
      const currentIndex = photoViews.findIndex(
        item =>
          item.candidatePhotoId === this.isDialogSelected?.candidatePhotoId
      );

      if (direction === 'prev' && currentIndex !== undefined) {
        if (currentIndex > 0) {
          this.showItem(
            currentIndex - 1,
            photoViews,
            this.votingArticleSelected
          );
        } else {
          this.showItem(
            photoViews.length - 1 || 0,
            photoViews,
            this.votingArticleSelected
          );
        }
      } else if (direction === 'next' && currentIndex !== undefined) {
        if (currentIndex < photoViews.length - 1) {
          this.showItem(
            currentIndex + 1,
            photoViews,
            this.votingArticleSelected
          );
        } else {
          this.showItem(0, photoViews, this.votingArticleSelected);
        }
      }
    }
  }

  protected onDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.goTo('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.goTo('prev');
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.isDialogSelected = null;
      this.votingArticleSelected = null;
    }
  }
}
