'use client';

import { TierChartLanguage, LANGUAGE_OPTIONS } from '@/types/tier';

interface LanguageFilterProps {
  value: TierChartLanguage | 'all';
  onChange: (value: TierChartLanguage | 'all') => void;
  className?: string;
}

export function LanguageFilter({ value, onChange, className = '' }: LanguageFilterProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => onChange('all')}
        className={`
          px-3 py-1.5 rounded-full text-sm transition-colors
          ${value === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }
        `}
      >
        All
      </button>
      {LANGUAGE_OPTIONS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`
            px-3 py-1.5 rounded-full text-sm transition-colors
            ${value === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
