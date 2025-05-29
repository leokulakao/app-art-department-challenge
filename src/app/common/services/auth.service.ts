import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

import { SupabaseService } from './supabase.service';
import { VotesStore } from '../signal-store/votes.store';
import { VotingArticlesStore } from '../signal-store/voting-articles.store';
import { Tables } from '../types/database.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;
  private readonly votesStore = inject(VotesStore);
  private readonly votingArticleStore = inject(VotingArticlesStore);
  private readonly _router = inject(Router);
  private readonly _userIdKey = 'user_id';

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(this._userIdKey);
  }

  get userId() {
    return localStorage.getItem(this._userIdKey);
  }

  async checkUser() {
    const result: PostgrestSingleResponse<Tables<'Users'>[]> =
      await this._supabaseClient
        .from('Users')
        .select('*')
        .eq('id', this.userId);
    if (result.error) {
      console.error('Error logging in user', result.error);
      return;
    }
    return result.data.length > 0 ? true : false;
  }

  async login() {
    const result: PostgrestSingleResponse<Tables<'Users'>[]> =
      await this._supabaseClient.from('Users').insert({}).select();
    if (result.error) {
      console.error('Error logging in user', result.error);
      return;
    }

    this._router.navigate(['/voting']);
    localStorage.setItem(this._userIdKey, `${result.data[0].id}`);
  }

  logout() {
    localStorage.removeItem(this._userIdKey);
    this.votesStore.invalidate();
    this.votingArticleStore.invalidate();
  }
}
