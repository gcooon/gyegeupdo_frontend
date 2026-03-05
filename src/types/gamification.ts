// 뱃지 타입
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'activity' | 'achievement' | 'special';
  requirement: {
    type: 'reviews' | 'votes' | 'visits' | 'tier_makers' | 'quizzes' | 'streak' | 'level';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 레벨 타입
export interface Level {
  level: number;
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
  color: string;
}

// 사용자 게이미피케이션 상태
export interface UserGamificationState {
  // 포인트 및 레벨
  points: number;
  level: number;

  // 획득한 뱃지 ID 목록
  earnedBadges: string[];

  // 활동 통계
  stats: {
    reviews: number;       // 작성한 리뷰 수
    votes: number;         // 투표 횟수
    visits: number;        // 방문 횟수
    tierMakers: number;    // 만든 계급도 수
    quizzes: number;       // 완료한 퀴즈 수
    streak: number;        // 연속 방문일
    lastVisit: string;     // 마지막 방문일 (ISO string)
  };
}

// 뱃지 정의
export const BADGES: Badge[] = [
  // Activity Badges
  {
    id: 'first-review',
    name: '첫 리뷰어',
    description: '첫 번째 리뷰를 작성했습니다',
    emoji: '✍️',
    category: 'activity',
    requirement: { type: 'reviews', value: 1 },
    rarity: 'common',
  },
  {
    id: 'reviewer-5',
    name: '리뷰 마니아',
    description: '5개의 리뷰를 작성했습니다',
    emoji: '📝',
    category: 'activity',
    requirement: { type: 'reviews', value: 5 },
    rarity: 'rare',
  },
  {
    id: 'reviewer-20',
    name: '리뷰 마스터',
    description: '20개의 리뷰를 작성했습니다',
    emoji: '📚',
    category: 'activity',
    requirement: { type: 'reviews', value: 20 },
    rarity: 'epic',
  },
  {
    id: 'first-vote',
    name: '첫 투표',
    description: '첫 번째 투표에 참여했습니다',
    emoji: '🗳️',
    category: 'activity',
    requirement: { type: 'votes', value: 1 },
    rarity: 'common',
  },
  {
    id: 'voter-10',
    name: '적극적인 참여자',
    description: '10회 투표에 참여했습니다',
    emoji: '⚡',
    category: 'activity',
    requirement: { type: 'votes', value: 10 },
    rarity: 'rare',
  },
  {
    id: 'first-tier-maker',
    name: '계급도 제작자',
    description: '나만의 계급도를 처음 만들었습니다',
    emoji: '🎨',
    category: 'activity',
    requirement: { type: 'tier_makers', value: 1 },
    rarity: 'common',
  },
  {
    id: 'first-quiz',
    name: '퀴즈 도전자',
    description: '첫 번째 퀴즈를 완료했습니다',
    emoji: '🎯',
    category: 'activity',
    requirement: { type: 'quizzes', value: 1 },
    rarity: 'common',
  },

  // Streak Badges
  {
    id: 'streak-3',
    name: '3일 연속',
    description: '3일 연속 방문했습니다',
    emoji: '🔥',
    category: 'achievement',
    requirement: { type: 'streak', value: 3 },
    rarity: 'common',
  },
  {
    id: 'streak-7',
    name: '일주일 열정',
    description: '7일 연속 방문했습니다',
    emoji: '💪',
    category: 'achievement',
    requirement: { type: 'streak', value: 7 },
    rarity: 'rare',
  },
  {
    id: 'streak-30',
    name: '한 달 마니아',
    description: '30일 연속 방문했습니다',
    emoji: '🏆',
    category: 'achievement',
    requirement: { type: 'streak', value: 30 },
    rarity: 'legendary',
  },

  // Level Badges
  {
    id: 'level-5',
    name: '성장하는 러너',
    description: '레벨 5에 도달했습니다',
    emoji: '🌱',
    category: 'achievement',
    requirement: { type: 'level', value: 5 },
    rarity: 'rare',
  },
  {
    id: 'level-10',
    name: '베테랑 러너',
    description: '레벨 10에 도달했습니다',
    emoji: '🌟',
    category: 'achievement',
    requirement: { type: 'level', value: 10 },
    rarity: 'epic',
  },
  {
    id: 'level-20',
    name: '전설의 러너',
    description: '레벨 20에 도달했습니다',
    emoji: '👑',
    category: 'achievement',
    requirement: { type: 'level', value: 20 },
    rarity: 'legendary',
  },

  // Special Badges
  {
    id: 'early-adopter',
    name: '얼리어답터',
    description: '계급도 서비스 초기 사용자입니다',
    emoji: '🚀',
    category: 'special',
    requirement: { type: 'visits', value: 1 },
    rarity: 'epic',
  },
];

// 레벨 정의
export const LEVELS: Level[] = [
  { level: 1, name: '러닝 입문자', emoji: '🐣', minPoints: 0, maxPoints: 100, color: '#94A3B8' },
  { level: 2, name: '가벼운 조깅러', emoji: '🚶', minPoints: 100, maxPoints: 250, color: '#94A3B8' },
  { level: 3, name: '취미 러너', emoji: '🏃', minPoints: 250, maxPoints: 500, color: '#10B981' },
  { level: 4, name: '열정 러너', emoji: '💨', minPoints: 500, maxPoints: 1000, color: '#10B981' },
  { level: 5, name: '숙련 러너', emoji: '⚡', minPoints: 1000, maxPoints: 2000, color: '#3B82F6' },
  { level: 6, name: '마라토너', emoji: '🏅', minPoints: 2000, maxPoints: 3500, color: '#3B82F6' },
  { level: 7, name: '베테랑 러너', emoji: '🌟', minPoints: 3500, maxPoints: 5500, color: '#8B5CF6' },
  { level: 8, name: '마스터 러너', emoji: '💎', minPoints: 5500, maxPoints: 8000, color: '#8B5CF6' },
  { level: 9, name: '엘리트 러너', emoji: '🔥', minPoints: 8000, maxPoints: 12000, color: '#F59E0B' },
  { level: 10, name: '전설의 러너', emoji: '👑', minPoints: 12000, maxPoints: Infinity, color: '#F59E0B' },
];

// 포인트 액션 정의
export const POINT_ACTIONS = {
  write_review: 50,
  receive_like: 5,
  vote: 2,
  complete_quiz: 20,
  create_tier: 30,
  daily_visit: 10,
  streak_bonus: 5, // per day
};

// 뱃지 희귀도별 색상
export const RARITY_COLORS = {
  common: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  rare: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
  epic: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
  legendary: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-300' },
};
