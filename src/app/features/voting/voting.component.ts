import { JsonPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { VotingService } from './voting.service';
import { SupabaseService } from '../../common/services/supabase.service';

@Component({
  selector: 'app-voting',
  template: `
    <h2>Welcome OverviewComponent</h2>

    <p>{{ votingService.getAllVotingArticles() | json }}</p>
  `,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingComponent {
  protected readonly supabaseClient = inject(SupabaseService).supabaseClient;
  protected readonly votingService = inject(VotingService);

  constructor() {
    this.supabaseClient.storage
      .from('photos')
      .list()
      .then(data => {
        console.log('data', data);
      });
  }
}
