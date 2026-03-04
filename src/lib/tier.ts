export type TierLevel = 'S' | 'A' | 'B' | 'C' | 'D';

export const TIER_CONFIG: Record<TierLevel, {
  bg: string;
  text: string;
  label: string;
  color: string;
  gradient: string;
}> = {
  S: {
    bg: 'tier-s',
    text: 'text-yellow-500',
    label: 'S티어',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  },
  A: {
    bg: 'tier-a',
    text: 'text-gray-400',
    label: 'A티어',
    color: '#C0C0C0',
    gradient: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)'
  },
  B: {
    bg: 'tier-b',
    text: 'text-amber-700',
    label: 'B티어',
    color: '#CD7F32',
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)'
  },
  C: {
    bg: 'tier-c',
    text: 'text-gray-500',
    label: 'C티어',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
  },
  D: {
    bg: 'tier-d',
    text: 'text-gray-700',
    label: 'D티어',
    color: '#374151',
    gradient: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)'
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
