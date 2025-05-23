import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { FileObject } from '@supabase/storage-js';
import { catchError, from, map } from 'rxjs';

import { SupabaseService } from '../../common/services/supabase.service';
import { Tables } from '../../common/types/database.types';

@Injectable({
  providedIn: 'root',
})
export class VotingService {
  private readonly _supabaseService = inject(SupabaseService);
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  readonly votingArticles = signal<Tables<'Voting Article'>[]>([]);
  readonly votingArticleMainPhotos = signal<FileObject[]>([]);
  readonly selectedVotingArticle = signal<Tables<'Voting Article'> | null>(
    null
  );
  readonly selectedVotingArticlePhotos = signal<FileObject[] | null>(null);

  readonly votingArticlesWithMainPhotos: Signal<
    (Tables<'Voting Article'> & {
      fileUrl: string;
    })[]
  > = computed(() => {
    const votingArticles = this.votingArticles();
    const votingArticleMainPhotos = this.votingArticleMainPhotos();

    const result: (Tables<'Voting Article'> & {
      fileUrl: string;
    })[] = [];

    votingArticles?.forEach(article => {
      const photo = votingArticleMainPhotos?.find(
        photo => photo.id === article.main_photo
      );
      if (photo) {
        result.push({
          ...article,
          fileUrl: this._supabaseService.supabasePhotoUrl + photo.name,
        });
      }
    });

    return result;
  });

  readonly getAllVotingArticles$ = from(
    this._supabaseClient.from('Voting Article').select('*')
  ).pipe(
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
  );

  readonly getAllVotingArticleMainPhotos$ = from(
    this._supabaseClient.storage.from('photos').list()
  ).pipe(
    map(result => {
      if (result.data == null) {
        console.error('No data found:', result.error);
        return [];
      }
      return result.data;
    }),
    catchError(error => {
      console.error('Error fetching voting articles:', error);
      return [];
    })
  );

  readonly getAllVotingArticlePhotos$ = from(
    this._supabaseClient.storage
      .from('photos')
      .list(`${this.selectedVotingArticle()?.id}/`)
  ).pipe(
    map(result => {
      if (result.data == null) {
        console.error('No data found:', result.error);
        return [];
      }
      return result.data;
    }),
    catchError(error => {
      console.error('Error fetching voting articles:', error);
      return [];
    })
  );
}
