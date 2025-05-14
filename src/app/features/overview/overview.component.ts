import { JsonPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { SupabaseService } from '../../common/services/supabase.service';

@Component({
  selector: 'app-overview',
  template: `
    <h2>Welcome</h2>
    @if (supabaseService.auth()) {
      <p>{{ supabaseService.auth() | json }}</p>
    }
  `,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  protected readonly supabaseService = inject(SupabaseService);

  constructor() {
    this.supabaseService.supabaseClient.storage
      .from('photos')
      .list()
      .then(data => {
        console.log('data', data);
      });
  }
}
