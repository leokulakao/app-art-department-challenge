import { computed, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FileObject } from '@supabase/storage-js';

import { LoadStatus } from './load-status.enum';
import { VotesStore } from './votes.store';
import { withPhotoStorage } from './with-photo-storage.store';
import { withVotingArticles } from './with-voting-articles.store';
import { SupabaseService } from '../services/supabase.service';
import { CandidatePhotoView, VotingArticleView } from '../types/app.types';

export const VotingArticlesStore = signalStore(
  withState<{ paramVotingArticleId: number | null }>({
    paramVotingArticleId: null,
  }),
  withVotingArticles(),
  withPhotoStorage(),
  withMethods(store => {
    const setVotingArticleId = (snapshot: ActivatedRouteSnapshot) => {
      patchState(store, {
        paramVotingArticleId: snapshot.params['votingArticleId'],
      });
    };

    const invalidate = () => {
      patchState(store, {
        photoStorageIsLoading: LoadStatus.INITIAL,
        votingArticlesAreLoading: LoadStatus.INITIAL,
      });
    };

    return { setVotingArticleId, invalidate };
  }),
  withComputed(
    (
      store,
      votesStore = inject(VotesStore),
      supabaseService = inject(SupabaseService)
    ) => {
      const votingArticlesWithPhoto = computed(() => {
        const votingArticleEntities = store.votingArticleEntities();
        const photoStorage = store.storageEntityMap();
        const userVotes = votesStore.votesEntities();

        const result: VotingArticleView[] = [];

        votingArticleEntities?.forEach(article => {
          const mainPhotoFileObject = article.main_photo
            ? photoStorage[article.main_photo]
            : null;

          const candidatePhotoViews: CandidatePhotoView[] = [];

          article.candidate_photos?.forEach(candidatePhotoId => {
            const candidatePhotoFileObject: FileObject | null =
              photoStorage[candidatePhotoId];
            candidatePhotoViews.push({
              candidatePhotoId: candidatePhotoId,
              candidatePhotoUrl: candidatePhotoFileObject
                ? supabaseService.supabasePhotoUrl +
                  candidatePhotoFileObject.name
                : null,
              isVoted: userVotes.find(
                vote => vote.candidate_photo_id === candidatePhotoId
              )
                ? true
                : false,
            });
          });

          result.push({
            ...article,
            mainPhotoUrl: mainPhotoFileObject
              ? supabaseService.supabasePhotoUrl + mainPhotoFileObject.name
              : null,
            candidatePhotoViews: candidatePhotoViews,
          });
        });

        return result;
      });

      const allArticleAreVoted = computed(() => {
        const articles = votingArticlesWithPhoto();
        const allAreVoted: boolean[] = [];
        articles.forEach(article => {
          const articleIsVoted =
            article.candidatePhotoViews.length > 0
              ? article.candidatePhotoViews.find(
                  candidatePhoto => candidatePhoto.isVoted
                )
              : true;

          allAreVoted.push(!!articleIsVoted);
        });
        console.log('allAreVoted', allAreVoted);
        return !allAreVoted.some(votedArticles => votedArticles === false);
      });

      const paramVotingArticle = computed(() => {
        const articles = votingArticlesWithPhoto();
        return articles.find(
          article => article.id == store.paramVotingArticleId()
        );
      });
      return {
        votingArticlesWithPhoto,
        paramVotingArticle,
        allArticleAreVoted,
      };
    }
  )
);
