import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Database } from '../types/database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  readonly supabaseClient: SupabaseClient;

  private readonly _supabaseUrl = 'https://xtyvhhxafahoksyzzsdn.supabase.co';
  private readonly _supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eXZoaHhhZmFob2tzeXp6c2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDUzNDYsImV4cCI6MjA2MjgyMTM0Nn0.ubzn5M0fjRsn9uMtA4uJJPAx-ekSzk6HyE7DUCG0mrw';

  constructor() {
    this.supabaseClient = createClient<Database>(
      this._supabaseUrl,
      this._supabaseKey
    );
  }
}
