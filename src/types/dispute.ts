import type { TierLevel } from '@/lib/tier';

export type VoteType = 'up' | 'down';

export interface VoteComment {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  voteType: VoteType;
  comment: string;
  createdAt: string;
  likes: number;
}

export interface ProductDispute {
  productId: number;
  productName: string;
  productSlug: string;
  brandName: string;
  currentTier: TierLevel;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  weekStartDate: string;
  weekEndDate: string;
  comments: VoteComment[];
  userVote?: VoteType; // Current user's vote if logged in
}

export interface DisputeSummary {
  productId: number;
  productName: string;
  productSlug: string;
  brandName: string;
  currentTier: TierLevel;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  topComment?: VoteComment;
  daysLeft: number;
}
