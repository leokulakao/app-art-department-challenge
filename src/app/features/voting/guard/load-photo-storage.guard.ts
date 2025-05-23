import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { LoadStatus } from '../../../common/signal-store/load-status.enum';
import { VotingArticlesStore } from '../../../common/signal-store/voting-articles.store';

export const loadPhotoStorageGuard = () => {
  const votingArticlesStore = inject(VotingArticlesStore);

  return toObservable(votingArticlesStore.photoStorageIsLoading).pipe(
    map(loadStatus => {
      if (loadStatus === LoadStatus.INITIAL) {
        votingArticlesStore.loadPhotoStorage();
      }
      return true;
    })
  );
};
