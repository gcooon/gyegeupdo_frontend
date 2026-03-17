'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { useTranslations } from '@/i18n';

interface CategoryTickerItem {
  slug: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface OfficialHeroSectionProps {
  ticker: CategoryTickerItem[];
}

export function OfficialHeroSection({ ticker }: OfficialHeroSectionProps) {
  const tOfficial = useTranslations('officialHub');

  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="relative text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-medium">{tOfficial('badge')}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {tOfficial('title')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {tOfficial('subtitle')}
        </p>

        {/* 카테고리 티커 */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-6">
          {ticker.map((cat) =>
            cat.enabled ? (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-medium text-xs transition-all hover:scale-105 hover:shadow-sm"
                style={{
                  borderColor: cat.color,
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                }}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ) : (
              <span
                key={cat.slug}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-400 font-medium text-xs cursor-default"
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px]">(준비중)</span>
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
