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
    text: 'text-pink-600',
    label: 'S급',
    color: '#FFB6C1',
    gradient: '#FFB6C1',
    glow: 'none',
    borderColor: '#FFB6C1',
    bgLight: 'rgba(255, 182, 193, 0.2)',
    emoji: '👑',
  },
  A: {
    bg: 'tier-a',
    text: 'text-orange-500',
    label: 'A급',
    color: '#FFDAB9',
    gradient: '#FFDAB9',
    glow: 'none',
    borderColor: '#FFDAB9',
    bgLight: 'rgba(255, 218, 185, 0.2)',
    emoji: '💎',
  },
  B: {
    bg: 'tier-b',
    text: 'text-yellow-600',
    label: 'B급',
    color: '#FFFFE0',
    gradient: '#FFFFE0',
    glow: 'none',
    borderColor: '#FFFFE0',
    bgLight: 'rgba(255, 255, 224, 0.25)',
    emoji: '✅',
  },
  C: {
    bg: 'tier-c',
    text: 'text-yellow-600',
    label: 'C급',
    color: '#EAB308',
    gradient: 'linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #CA8A04 100%)',
    glow: 'none',
    borderColor: '#FDE047',
    bgLight: 'rgba(234, 179, 8, 0.15)',
    emoji: '📦',
  },
  D: {
    bg: 'tier-d',
    text: 'text-orange-600',
    label: 'D급',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
    glow: 'none',
    borderColor: '#FB923C',
    bgLight: 'rgba(249, 115, 22, 0.15)',
    emoji: '⚠️',
  },
};

export function getTierFromScore(score: number): TierLevel {
  if (score >= 85) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'D';
}

export function getTierConfig(tier: TierLevel) {
  return TIER_CONFIG[tier];
}

export function getTierClassName(tier: TierLevel): string {
  return `tier-${tier.toLowerCase()}`;
}
