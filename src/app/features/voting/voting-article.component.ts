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
              <h1>{{ votingArticle.title }}</h1>
              <h2>Galeria de fotos</h2>
              <p>
                De estas fotos elige la que más te guste en función de
                originalidad, interpretacióin y vestimenta.
              </p>
            </div>

            <div
              class="articles__list articles__list--candidates"
              [class]="{
                'articles__list--voted': showVoteButton,
              }">
              @for (item of votingArticle.candidatePhotoViews; track $index) {
                <div
                  id="candidate-{{ item.candidatePhotoId }}"
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
                    <svg
                      class="candidate__svg"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24">
                      <path
                        d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
                    </svg>
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
        <div class="container">
          <button class="button" (click)="onBack()">
            Ir al menú principal
          </button>
        </div>
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

  protected hideModal() {
    const lastIndex = this.isDialogSelected;

    this.isDialogSelected = null;
    this.votingArticleSelected = null;
    document.documentElement.classList.remove('overflow-hidden');

    const el = document.getElementById(
      `candidate-${lastIndex?.candidatePhotoId}`
    );
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  protected showItem(
    index: number | null,
    all: CandidatePhotoView[] = [],
    votingArticleId?: number
  ) {
    if (index === null) {
      this.hideModal();
      return;
    }

    this.isDialogSelected = all[index] || null;
    this.votingArticleSelected = votingArticleId || null;
    document.documentElement.classList.add('overflow-hidden');

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
      this.hideModal();
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
      this.hideModal();
    }
  }
}
