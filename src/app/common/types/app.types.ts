import { Tables } from './database.types';

export interface VotingArticleView extends Tables<'Voting Article'> {
  mainPhotoUrl: string | null;
  candidatePhotoViews: CandidatePhotoView[];
}

export interface CandidatePhotoView {
  candidatePhotoId: string;
  candidatePhotoUrl: string | null;
  isVoted: boolean;
}
