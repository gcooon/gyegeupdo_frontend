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
    text: 'text-purple-600',
    label: 'S급',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)',
    glow: '0 0 20px rgba(139, 92, 246, 0.5)',
    borderColor: '#A78BFA',
    bgLight: 'rgba(139, 92, 246, 0.15)',
    emoji: '👑',
  },
  A: {
    bg: 'tier-a',
    text: 'text-blue-600',
    label: 'A급',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #2563EB 100%)',
    glow: '0 0 15px rgba(59, 130, 246, 0.4)',
    borderColor: '#60A5FA',
    bgLight: 'rgba(59, 130, 246, 0.15)',
    emoji: '💎',
  },
  B: {
    bg: 'tier-b',
    text: 'text-green-600',
    label: 'B급',
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 50%, #16A34A 100%)',
    glow: '0 0 12px rgba(34, 197, 94, 0.4)',
    borderColor: '#4ADE80',
    bgLight: 'rgba(34, 197, 94, 0.15)',
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
