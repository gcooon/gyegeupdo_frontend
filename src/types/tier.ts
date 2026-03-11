import { TierLevel } from '@/lib/tier';

// ===== 국제화 타입 =====

export type TierChartLanguage = 'ko' | 'en' | 'ja' | 'zh';

export const LANGUAGE_OPTIONS: { code: TierChartLanguage; name: string; flag: string }[] = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const getLanguageInfo = (code: TierChartLanguage) =>
  LANGUAGE_OPTIONS.find(l => l.code === code) || LANGUAGE_OPTIONS[0];

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

// ===== 승격 시스템 타입 =====

export type PromotionStatus = 'normal' | 'rising' | 'candidate' | 'promoted' | 'hall_of_fame';

export interface PromotionScoreBreakdown {
  likes: number;
  views: number;
  comments: number;
}

export interface PromotionProgress {
  current_score: number;
  target_score: number | null;
  progress_percent: number;
  status: PromotionStatus;
  status_display: string;
  score_breakdown?: PromotionScoreBreakdown;
  hot_until?: string;  // HOT 상태일 때 만료 시간
}

// ===== 사용자 계급도 타입 =====

export interface TierChartItem {
  name: string;
  reason?: string;
  imageUrl?: string;
}

export interface TierChartData {
  S?: TierChartItem[];
  A?: TierChartItem[];
  B?: TierChartItem[];
  C?: TierChartItem[];
  D?: TierChartItem[];
}

export interface UserTierChart {
  id: number;
  uuid: string;
  slug: string;
  title: string;
  description: string;
  tier_data: TierChartData;
  user_nickname: string;
  user_badge: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_owner: boolean;
  is_featured: boolean;
  visibility: 'public' | 'private';
  share_url: string;
  created_at: string;
  updated_at: string;
  comments?: TierChartComment[];
  // 승격 시스템
  promotion_score?: number;
  promotion_status?: PromotionStatus;
  promotion_status_display?: string;
  promotion_progress?: PromotionProgress;
  // 국제화
  language?: TierChartLanguage;
  language_display?: string;
  author_country?: string;
  is_global?: boolean;
}

export interface UserTierChartListItem {
  id: number;
  uuid: string;
  slug: string;
  title: string;
  description: string;
  user_nickname: string;
  user_badge: string;
  item_count: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_featured: boolean;
  created_at: string;
  // 승격 시스템
  promotion_score?: number;
  promotion_status?: PromotionStatus;
  promotion_status_display?: string;
  promotion_progress?: Omit<PromotionProgress, 'score_breakdown'>;
  hot_until?: string;  // HOT 만료 시간
  hall_of_fame_at?: string;  // 명예의전당 등록 시간
  // 국제화
  language?: TierChartLanguage;
  language_display?: string;
  author_country?: string;
}

export interface TierChartComment {
  id: number;
  user_nickname: string;
  user_badge: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  parent: number | null;
  replies: TierChartComment[];
  is_owner: boolean;
}

export interface UserTierChartListResponse {
  items: UserTierChartListItem[];
  total_count: number;
  page: number;
  limit: number;
  has_next: boolean;
}

export interface CreateTierChartPayload {
  title: string;
  description?: string;
  tier_data: TierChartData;
  visibility?: 'public' | 'private';
  language?: TierChartLanguage;
}
