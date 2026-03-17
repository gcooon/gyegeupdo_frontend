export type TierLevel = 'S' | 'A' | 'B' | 'C' | 'D';

export const TIER_CONFIG: Record<TierLevel, {
  bg: string;
  text: string;
  label: string;
  color: string;
  gradient: string;
  glow: string;
  borderColor: string;
  bgLight: string;
  emoji: string;
}> = {
  S: {
    bg: 'tier-s',
    text: 'text-amber-700',
    label: '황제',
    color: '#FFD700',
    gradient: '#FFD700',
    glow: 'none',
    borderColor: '#FFD700',
    bgLight: 'rgba(255, 215, 0, 0.2)',
    emoji: '👑',
  },
  A: {
    bg: 'tier-a',
    text: 'text-purple-600',
    label: '왕',
    color: '#9370DB',
    gradient: '#9370DB',
    glow: 'none',
    borderColor: '#9370DB',
    bgLight: 'rgba(147, 112, 219, 0.2)',
    emoji: '🏰',
  },
  B: {
    bg: 'tier-b',
    text: 'text-blue-600',
    label: '양반',
    color: '#4169E1',
    gradient: '#4169E1',
    glow: 'none',
    borderColor: '#4169E1',
    bgLight: 'rgba(65, 105, 225, 0.2)',
    emoji: '🎓',
  },
  C: {
    bg: 'tier-c',
    text: 'text-emerald-600',
    label: '중인',
    color: '#3CB371',
    gradient: '#3CB371',
    glow: 'none',
    borderColor: '#3CB371',
    bgLight: 'rgba(60, 179, 113, 0.2)',
    emoji: '🏠',
  },
  D: {
    bg: 'tier-d',
    text: 'text-stone-600',
    label: '평민',
    color: '#8B7355',
    gradient: '#8B7355',
    glow: 'none',
    borderColor: '#8B7355',
    bgLight: 'rgba(139, 115, 85, 0.2)',
    emoji: '🌾',
  },
};

export function getTierFromScore(score: number): TierLevel {
  if (score >= 85) return 'S';  // 황제
  if (score >= 75) return 'A';  // 왕 (백엔드 기준: 75)
  if (score >= 60) return 'B';  // 양반 (백엔드 기준: 60)
  if (score >= 45) return 'C';  // 중인 (백엔드 기준: 45)
  return 'D';                   // 평민
}

export function getTierConfig(tier: TierLevel) {
  return TIER_CONFIG[tier];
}

export function getTierClassName(tier: TierLevel): string {
  return `tier-${tier.toLowerCase()}`;
}
