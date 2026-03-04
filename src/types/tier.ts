import { TierLevel } from '@/lib/tier';

export interface TierDispute {
  id: number;
  model_id: number;
  model_name: string;
  user_id: number;
  user_badge: string;
  dispute_type: 'upgrade' | 'downgrade';
  reason: string;
  evidence_url?: string;
  support_count: number;
  oppose_count?: number;
  status: 'pending' | 'colosseum' | 'resolved' | 'rejected';
  resolution?: string;
  created_at: string;
  resolved_at?: string;
}

export interface DisputeVote {
  id: number;
  dispute_id: number;
  user_id: number;
  vote: 'support' | 'oppose';
  created_at: string;
}

export interface TrendItem {
  model_id: number;
  model_name: string;
  model_slug: string;
  brand_name: string;
  tier: TierLevel;
  trend: 'up' | 'down' | 'stable';
  score_change: number;
  rank: number;
  image_url?: string;
}

export interface TrendResponse {
  period: 'weekly' | 'monthly';
  direction: 'up' | 'down';
  items: TrendItem[];
}
