import { TierLevel, getTierConfig } from '@/lib/tier';
import { cn } from '@/lib/utils';

interface TierBadgeProps {
  tier: TierLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function TierBadge({
  tier,
  size = 'md',
  showLabel = true,
  className,
}: TierBadgeProps) {
  const config = getTierConfig(tier);

  const sizeClasses = {
    sm: 'min-w-[24px] h-6 px-1.5 text-xs',
    md: 'min-w-[32px] h-8 px-2 text-sm',
    lg: 'min-w-[40px] h-10 px-3 text-base',
  };

  // Text color: black for gold/silver, white for bronze and below
  const textColorClass = tier === 'S' || tier === 'A' ? 'text-black' : 'text-white';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-bold shadow-sm',
        sizeClasses[size],
        textColorClass,
        className
      )}
      style={{ background: config.gradient }}
    >
      {showLabel ? config.label : tier}
    </span>
  );
}
