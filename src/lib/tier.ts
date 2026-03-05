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
    text: 'text-amber-500',
    label: 'S급',
    color: '#D4AF37',
    gradient: 'linear-gradient(145deg, #FFD700 0%, #D4AF37 25%, #B8860B 50%, #D4AF37 75%, #FFD700 100%)',
    glow: '0 0 25px rgba(212, 175, 55, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    borderColor: '#D4AF37',
    bgLight: 'rgba(212, 175, 55, 0.15)',
    emoji: '👑',
  },
  A: {
    bg: 'tier-a',
    text: 'text-slate-800',
    label: 'A급',
    color: '#1a1a1a',
    gradient: 'linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 25%, #0d0d0d 50%, #1a1a1a 75%, #2d2d2d 100%)',
    glow: '0 0 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    borderColor: '#333333',
    bgLight: 'rgba(26, 26, 26, 0.1)',
    emoji: '🖤',
  },
  B: {
    bg: 'tier-b',
    text: 'text-slate-400',
    label: 'B급',
    color: '#C0C0C0',
    gradient: 'linear-gradient(145deg, #E8E8E8 0%, #C0C0C0 25%, #A8A8A8 50%, #C0C0C0 75%, #E8E8E8 100%)',
    glow: '0 0 15px rgba(192, 192, 192, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    borderColor: '#C0C0C0',
    bgLight: 'rgba(192, 192, 192, 0.15)',
    emoji: '🥈',
  },
  C: {
    bg: 'tier-c',
    text: 'text-gray-500',
    label: 'C급',
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
    label: 'D급',
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
