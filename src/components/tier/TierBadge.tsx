'use client';

import { TierLevel, getTierConfig } from '@/lib/tier';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TierBadgeProps {
  tier: TierLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  showEmoji?: boolean;
  className?: string;
}

export function TierBadge({
  tier,
  size = 'md',
  showLabel = true,
  animated = false,
  showEmoji = false,
  className,
}: TierBadgeProps) {
  const config = getTierConfig(tier);
  const isSTier = tier === 'S';

  const sizeClasses = {
    sm: 'min-w-[24px] h-6 px-1.5 text-xs gap-0.5',
    md: 'min-w-[32px] h-8 px-2 text-sm gap-1',
    lg: 'min-w-[40px] h-10 px-3 text-base gap-1.5',
  };

  // Text color: black for gold/silver, white for bronze and below
  const textColorClass = tier === 'S' || tier === 'A' ? 'text-black' : 'text-white';

  const BadgeContent = (
    <>
      {showEmoji && <span>{config.emoji}</span>}
      <span>{showLabel ? config.label : tier}</span>
    </>
  );

  if (animated) {
    return (
      <motion.span
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-bold relative overflow-hidden',
          sizeClasses[size],
          textColorClass,
          className
        )}
        style={{
          background: config.gradient,
          boxShadow: isSTier ? config.glow : 'none',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        whileHover={{ scale: 1.05 }}
      >
        {BadgeContent}
        {/* S티어 반짝임 효과 */}
        {isSTier && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
              repeatDelay: 1
            }}
          />
        )}
      </motion.span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-bold shadow-sm relative overflow-hidden',
        sizeClasses[size],
        textColorClass,
        isSTier && 'animate-pulse-subtle',
        className
      )}
      style={{
        background: config.gradient,
        boxShadow: isSTier ? config.glow : 'none',
      }}
    >
      {BadgeContent}
    </span>
  );
}
