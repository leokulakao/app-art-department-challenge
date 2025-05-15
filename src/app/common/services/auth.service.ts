import { inject, Injectable } from '@angular/core';

import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;
  private readonly _userIdKey = 'user_id';

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(this._userIdKey);
  }

  async login() {
    const result = await this._supabaseClient.from('Users').insert({}).select();
    if (result.error) {
      console.error('Error logging in user', result.error);
      return;
    }

    localStorage.setItem(this._userIdKey, result.data[0].id);
  }
}
