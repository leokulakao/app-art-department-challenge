import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { SupabaseService } from '../../common/services/supabase.service';

@Component({
  selector: 'app-overview',
  template: ` <h2>Welcome OverviewComponent</h2> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  protected readonly supabaseClient = inject(SupabaseService).supabaseClient;

  constructor() {
    this.supabaseClient.storage
      .from('photos')
      .list()
      .then(data => {
        console.log('data', data);
      });
  }
}
