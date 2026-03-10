'use client';

import { TierChartLanguage, getLanguageInfo } from '@/types/tier';

interface LanguageBadgeProps {
  language: TierChartLanguage;
  showName?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function LanguageBadge({
  language,
  showName = false,
  size = 'sm',
  className = '',
}: LanguageBadgeProps) {
  const info = getLanguageInfo(language);

  return (
    <span
      className={`
        inline-flex items-center gap-0.5 rounded
        ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'}
        bg-muted text-muted-foreground
        ${className}
      `}
      title={info.name}
    >
      <span>{info.flag}</span>
      {showName && <span>{info.name}</span>}
    </span>
  );
}
