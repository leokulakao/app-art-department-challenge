import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { LoadStatus } from '../../../common/signal-store/load-status.enum';
import { VotesStore } from '../../../common/signal-store/votes.store';

export const loadVotesGuard = () => {
  const votesStore = inject(VotesStore);

  return toObservable(votesStore.votesAreLoading).pipe(
    map(loadStatus => {
      if (loadStatus === LoadStatus.INITIAL) {
        votesStore.loadVotes();
      }
      return true;
    })
  );
};
