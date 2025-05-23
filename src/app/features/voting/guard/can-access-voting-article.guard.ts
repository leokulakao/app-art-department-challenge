import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { VotingService } from '../voting.service';

export const canAccessVotingArticleGuard = (route: ActivatedRouteSnapshot) => {
  const votingService = inject(VotingService);
  const votingArticles = votingService.votingArticles();

  const articleId = route.params['articleId'];
  if (articleId == null) {
    return false;
  }

  const selectedVotingArticle = votingArticles.find(
    article => article.id === Number(articleId)
  );

  if (selectedVotingArticle == null) {
    return false;
  }

  votingService.selectedVotingArticle.set(selectedVotingArticle);

  return true;
};
