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
    text: 'text-amber-600',
    label: 'S티어',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
    glow: '0 0 20px rgba(251, 191, 36, 0.5)',
    borderColor: '#FBBF24',
    bgLight: 'rgba(251, 191, 36, 0.1)',
    emoji: '👑',
  },
  A: {
    bg: 'tier-a',
    text: 'text-slate-500',
    label: 'A티어',
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 50%, #94A3B8 100%)',
    glow: '0 0 15px rgba(148, 163, 184, 0.4)',
    borderColor: '#CBD5E1',
    bgLight: 'rgba(148, 163, 184, 0.1)',
    emoji: '🥈',
  },
  B: {
    bg: 'tier-b',
    text: 'text-orange-600',
    label: 'B티어',
    color: '#EA580C',
    gradient: 'linear-gradient(135deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)',
    glow: '0 0 12px rgba(234, 88, 12, 0.3)',
    borderColor: '#FB923C',
    bgLight: 'rgba(234, 88, 12, 0.1)',
    emoji: '🥉',
  },
  C: {
    bg: 'tier-c',
    text: 'text-gray-500',
    label: 'C티어',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #4B5563 100%)',
    glow: 'none',
    borderColor: '#9CA3AF',
    bgLight: 'rgba(107, 114, 128, 0.1)',
    emoji: '📦',
  },
  D: {
    bg: 'tier-d',
    text: 'text-gray-700',
    label: 'D티어',
    color: '#374151',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 50%, #374151 100%)',
    glow: 'none',
    borderColor: '#6B7280',
    bgLight: 'rgba(55, 65, 81, 0.1)',
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
