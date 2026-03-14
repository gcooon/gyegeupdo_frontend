export type WidthScore = 'narrow' | 'normal' | 'wide';
export type SizeFit = 'half_up' | 'true' | 'half_down';
export type UserBadge = 'none' | 'verified' | 'reviewer' | 'master' | 'pioneer';

export interface Review {
  id: number;
  model_id: number;
  user_id: number;
  user_badge: UserBadge;
  fit_score: 1 | 2 | 3 | 4 | 5;
  width_score: WidthScore;
  size_fit: SizeFit;
  usage_fit: 1 | 2 | 3 | 4 | 5;
  pain_level: 0 | 1 | 2 | 3 | 4 | 5;
  durability_score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  proof_image_url?: string;
  running_km_at_review: number;
  created_at: string;
}

export interface ReviewCreateInput {
  model_id: number;
  fit_score: number;
  width_score: WidthScore;
  size_fit: SizeFit;
  usage_fit: number;
  pain_level: number;
  durability_score: number;
  comment?: string;
  running_km_at_review: number;
  proof_image_url?: string;
}

export interface SimilarUserStats {
  total: number;
  avg_fit_score: number;
  avg_size_fit: SizeFit;
}

export interface ReviewListResponse {
  similar_user_stats: SimilarUserStats;
  reviews: Review[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ReviewFilters {
  width?: WidthScore;
  pronation?: 'overpronation' | 'neutral' | 'supination';
  page?: number;
}
