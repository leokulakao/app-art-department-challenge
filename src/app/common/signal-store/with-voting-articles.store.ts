import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
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
import { from, map, pipe, switchMap, tap } from 'rxjs';

import { LoadStatus } from './load-status.enum';
import { SupabaseService } from '../services/supabase.service';
import { Tables } from '../types/database.types';

const selectId: SelectEntityId<Tables<'Voting Article'>> = votingArticle =>
  votingArticle.id;

export const withVotingArticles = () => {
  return signalStoreFeature(
    withState({
      votingArticlesAreLoading: LoadStatus.INITIAL,
    }),
    withEntities({
      entity: type<Tables<'Voting Article'>>(),
      collection: 'votingArticle',
    }),
    withMethods(store => {
      const supabaseClient = inject(SupabaseService).supabaseClient;
      const loadVotingArticles = rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, { votingArticlesAreLoading: LoadStatus.LOADING })
          ),
          switchMap(() => {
            return from(supabaseClient.from('Voting Article').select('*')).pipe(
              map(
                (
                  result: PostgrestSingleResponse<Tables<'Voting Article'>[]>
                ) => {
                  if (result.data == null) {
                    return;
                  }

                  patchState(
                    store,
                    addEntities(result.data, {
                      collection: 'votingArticle',
                      selectId,
                    })
                  );
                  patchState(store, {
                    votingArticlesAreLoading: LoadStatus.LOADED,
                  });
                }
              )
            );
          })
        )
      );
      return { loadVotingArticles };
    })
  );
};
