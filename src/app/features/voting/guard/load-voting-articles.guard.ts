import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { LoadStatus } from '../../../common/signal-store/load-status.enum';
import { VotingArticlesStore } from '../../../common/signal-store/voting-articles.store';

export const loadVotingArticlesGuard = () => {
  const votingArticlesStore = inject(VotingArticlesStore);

  return toObservable(votingArticlesStore.votingArticlesAreLoading).pipe(
    map(loadStatus => {
      if (loadStatus === LoadStatus.INITIAL) {
        votingArticlesStore.loadVotingArticles();
      }
      return true;
    })
  );
};
