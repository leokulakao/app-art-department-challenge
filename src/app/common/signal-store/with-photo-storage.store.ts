import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import {
  withEntities,
  addEntities,
  SelectEntityId,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FileObject, StorageError } from '@supabase/storage-js';
import { pipe, tap, switchMap, from, map } from 'rxjs';

import { LoadStatus } from './load-status.enum';
import { SupabaseService } from '../services/supabase.service';

export interface FileObjectResult {
  data: FileObject[] | null;
  error: StorageError | null;
}

const selectId: SelectEntityId<FileObject> = fileObject => fileObject.id;

export const withPhotoStorage = () => {
  return signalStoreFeature(
    withState({
      photoStorageIsLoading: LoadStatus.INITIAL,
    }),
    withEntities({
      entity: type<FileObject>(),
      collection: 'storage',
    }),
    withMethods(store => {
      const supabaseClient = inject(SupabaseService).supabaseClient;
      const loadPhotoStorage = rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, { photoStorageIsLoading: LoadStatus.LOADING })
          ),
          switchMap(() => {
            return from(supabaseClient.storage.from('photos').list()).pipe(
              map((result: FileObjectResult) => {
                if (result.data == null) {
                  return;
                }

                patchState(
                  store,
                  addEntities(result.data, {
                    collection: 'storage',
                    selectId,
                  })
                );
                patchState(store, { photoStorageIsLoading: LoadStatus.LOADED });
              })
            );
          })
        )
      );

      return { loadPhotoStorage };
    })
  );
};
