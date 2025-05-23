import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntities,
  SelectEntityId,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { pipe, tap, switchMap, from, map } from 'rxjs';

import { LoadStatus } from './load-status.enum';
import { SupabaseService } from '../services/supabase.service';
import { Tables } from '../types/database.types';

const selectId: SelectEntityId<Tables<'Votes'>> = vote => vote.id;

export const VotesStore = signalStore(
  withState({
    votesAreLoading: LoadStatus.INITIAL,
  }),
  withEntities({
    entity: type<Tables<'Votes'>>(),
    collection: 'votes',
  }),
  withMethods(store => {
    const supabaseClient = inject(SupabaseService).supabaseClient;
    const loadVotes = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { votesAreLoading: LoadStatus.LOADING })),
        switchMap(() => {
          return from(
            supabaseClient
              .from('Votes')
              .select('*')
              .eq('user', localStorage.getItem('user_id'))
          ).pipe(
            map((result: PostgrestSingleResponse<Tables<'Votes'>[]>) => {
              if (result.data == null) {
                return;
              }

              patchState(
                store,
                addEntities(result.data, {
                  collection: 'votes',
                  selectId,
                })
              );
              patchState(store, { votesAreLoading: LoadStatus.LOADED });
            })
          );
        })
      )
    );

    const vote = rxMethod<{
      votingArticleId: number;
      candidatePhotoId: string;
    }>(
      pipe(
        tap(() => patchState(store, { votesAreLoading: LoadStatus.LOADING })),
        switchMap(({ votingArticleId, candidatePhotoId }) => {
          return from(
            supabaseClient
              .from('Votes')
              .insert({
                voting_article_id: votingArticleId,
                user: localStorage.getItem('user_id'),
                candidate_photo_id: candidatePhotoId,
                voted: true,
              })
              .select()
          ).pipe(
            map((result: PostgrestSingleResponse<Tables<'Votes'>[]>) => {
              if (result.data == null) {
                return;
              }

              patchState(
                store,
                addEntities(result.data, {
                  collection: 'votes',
                  selectId,
                })
              );
              patchState(store, { votesAreLoading: LoadStatus.LOADED });
            })
          );
        })
      )
    );

    const invalidate = () => {
      patchState(store, { votesAreLoading: LoadStatus.INITIAL });
    };

    return { loadVotes, vote, invalidate };
  })
);
