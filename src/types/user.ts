export type FootWidth = 'narrow' | 'normal' | 'wide' | 'extra_wide';
export type Pronation = 'overpronation' | 'neutral' | 'supination';
export type UsageType = 'beginner' | 'daily' | 'tempo' | 'race';
export type Priority = 'cushion' | 'speed' | 'design';
export type Badge = 'none' | 'verified' | 'reviewer' | 'master' | 'pioneer';

export interface UserProfile {
  id: number;
  user_id: number;
  foot_width: FootWidth;
  pronation: Pronation;
  usage_type: UsageType;
  budget_min: number;
  budget_max: number;
  priority: Priority;
  total_km: number;
  strava_proof_url?: string;
  badge: Badge;
  review_weight: number;
  review_count: number;
  dispute_accepted_count: number;
  created_at: string;
}

export interface BadgeProgress {
  current_badge: Badge;
  next_badge: Badge;
  progress: {
    review_count: number;
    review_required: number;
    km: number;
    km_required: number;
  };
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile?: UserProfile;
}
