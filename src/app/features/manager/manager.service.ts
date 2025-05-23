import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, map, catchError } from 'rxjs';

import { SupabaseService } from '../../common/services/supabase.service';
import { Tables } from '../../common/types/database.types';

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  readonly getAllVotingArticles = toSignal(
    from(this._supabaseClient.from('Voting Article').select('*')).pipe(
      map(result => {
        if (result.data == null) {
          console.error('No data found:', result.error);
          return [];
        }
        return result.data as Tables<'Voting Article'>[];
      }),
      catchError(error => {
        console.error('Error fetching voting articles:', error);
        return [];
      })
    )
  );
}
