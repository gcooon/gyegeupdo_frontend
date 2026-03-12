'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Flame, Crown, Eye, Plus, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useTranslations } from '@/i18n';

interface OpenTierStats {
  total_charts: number;
  hall_of_fame_count: number;
  total_views: number;
}

export function OpenHeroSection() {
  const [stats, setStats] = useState<OpenTierStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('openHub');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: OpenTierStats;
        }>('/tiers/user-charts/stats/');

        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch {
        setStats({
          total_charts: 245,
          hall_of_fame_count: 12,
          total_views: 28420,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return String(num);
  };

  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="relative text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-accent/10 text-accent border border-accent/20">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">{t('badge')}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-2">
          {t('subtitle')}
        </p>
        <p className="text-sm md:text-base text-amber-600 font-medium max-w-xl mx-auto mb-6 flex items-center justify-center gap-1.5">
          <Crown className="h-4 w-4 text-amber-500 shrink-0" />
          <span>{t('subtitleReward')}</span>
        </p>

        {/* 통계 */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : stats ? (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
              <Flame className="h-4 w-4 mr-1.5 text-orange-500" />
              {t('totalCharts', { count: stats.total_charts })}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
              <Crown className="h-4 w-4 mr-1.5 text-amber-500" />
              {t('hallOfFame', { count: stats.hall_of_fame_count })}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
              <Eye className="h-4 w-4 mr-1.5 text-blue-500" />
              {t('totalViews', { count: formatNumber(stats.total_views) })}
            </Badge>
          </div>
        ) : null}

        {/* CTA 버튼 */}
        <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
          <Link href="/open/create">
            <Plus className="h-5 w-5 mr-2" />
            {t('createButton')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
