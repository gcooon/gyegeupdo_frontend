'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Heart, Eye, MessageCircle, Loader2, Star } from 'lucide-react';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import api from '@/lib/api';
import type { UserTierChartListItem } from '@/types/tier';
import { useTranslations } from '@/i18n';

export function FeaturedCharts() {
  const [featuredCharts, setFeaturedCharts] = useState<UserTierChartListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('openHub');
  const tTierChart = useTranslations('tierChart');

  useEffect(() => {
    const fetchFeaturedCharts = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: { items: UserTierChartListItem[] } | UserTierChartListItem[];
        }>('/tiers/user-charts/?is_featured=true&limit=4');

        if (response.data.success) {
          const data = response.data.data;
          if (Array.isArray(data)) {
            setFeaturedCharts(data);
          } else {
            setFeaturedCharts(data.items);
          }
        }
      } catch {
        setFeaturedCharts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCharts();
  }, []);

  if (!isLoading && featuredCharts.length === 0) {
    return null;
  }

  const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];
  const mainChart = featuredCharts[0];
  const subCharts = featuredCharts.slice(1, 4);

  return (
    <section className="py-8 bg-gradient-to-r from-amber-500/5 to-orange-500/5 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {t('featuredTitle')}
                <Badge className="bg-amber-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  {tTierChart('featured')}
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">{t('featuredDesc')}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="border-amber-500/50 text-amber-600 hover:bg-amber-50" asChild>
          <Link href="/open?tab=hall_of_fame">
            {t('viewFeatured')}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 메인 피처드 카드 (모바일에서는 일반 크기, 데스크탑에서는 2열) */}
          {mainChart && (
            <Link href={`/open/${mainChart.slug}`} className="md:col-span-2">
              <Card className="h-full hover:shadow-xl transition-all hover:scale-[1.01] group cursor-pointer overflow-hidden border-amber-200">
                {/* 티어 프리뷰 */}
                <div className="h-3 flex">
                  {tiers.map((tier) => (
                    <div
                      key={tier}
                      className="flex-1"
                      style={{ background: TIER_CONFIG[tier].gradient }}
                    />
                  ))}
                </div>

                <CardContent className="p-5">
                  {/* 피처드 뱃지 */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="h-3.5 w-3.5 mr-1" />
                      {t('featuredPick')}
                    </Badge>
                    {mainChart.promotion_status === 'hall_of_fame' && (
                      <Badge variant="outline" className="text-amber-600 border-amber-500">
                        {t('hallOfFameBadge')}
                      </Badge>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                    {mainChart.title}
                  </h3>

                  {/* 설명 */}
                  {mainChart.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {mainChart.description}
                    </p>
                  )}

                  {/* 작성자 + 통계 */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {mainChart.user_nickname}
                    </Badge>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className={`h-4 w-4 ${mainChart.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                        {mainChart.like_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {mainChart.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {mainChart.comment_count}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* 서브 피처드 카드들 */}
          {subCharts.map((chart) => (
            <Link key={chart.id} href={`/open/${chart.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group cursor-pointer overflow-hidden">
                {/* 티어 미니 프리뷰 */}
                <div className="h-2 flex">
                  {tiers.map((tier) => (
                    <div
                      key={tier}
                      className="flex-1"
                      style={{ background: TIER_CONFIG[tier].gradient }}
                    />
                  ))}
                </div>

                <CardContent className="p-4">
                  {/* 피처드 뱃지 */}
                  <div className="flex items-center justify-between mb-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] text-muted-foreground">
                      {chart.item_count}개 항목
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                    {chart.title}
                  </h3>

                  {/* 작성자 */}
                  <p className="text-xs text-muted-foreground mb-3 truncate">
                    {chart.user_nickname}
                  </p>

                  {/* 통계 */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-3 w-3" />
                      {chart.like_count}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Eye className="h-3 w-3" />
                      {chart.view_count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
