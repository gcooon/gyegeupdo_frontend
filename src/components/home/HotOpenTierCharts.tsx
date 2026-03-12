'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, ArrowRight, Heart, Eye, Crown, Loader2 } from 'lucide-react';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import api from '@/lib/api';
import type { UserTierChartListItem } from '@/types/tier';
import { useTranslations } from '@/i18n';

export function HotOpenTierCharts() {
  const [hotCharts, setHotCharts] = useState<UserTierChartListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('openTier');
  const tPromotion = useTranslations('promotion');

  useEffect(() => {
    const fetchHotCharts = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: UserTierChartListItem[];
        }>('/tiers/user-charts/hot_charts/?limit=6');

        if (response.data.success) {
          setHotCharts(response.data.data);
        }
      } catch {
        // API 실패 시 빈 목록 유지
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotCharts();
  }, []);

  // HOT 계급도가 없으면 섹션 숨김
  if (!isLoading && hotCharts.length === 0) {
    return null;
  }

  const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

  return (
    <section className="py-8 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-amber-500/5 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {tPromotion('hot')} {t('title')}
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs animate-pulse">
                  NEW
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">{tPromotion('hotDescription')}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="border-orange-500/50 text-orange-600 hover:bg-orange-50" asChild>
          <Link href="/open">
            {t('viewAll')}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hotCharts.map((chart) => (
            <Link key={chart.id} href={`/open/${chart.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group cursor-pointer overflow-hidden border-orange-200/50">
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

                <CardContent className="p-3">
                  {/* HOT 뱃지 */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] px-1.5 py-0">
                      <Flame className="h-3 w-3 mr-0.5" />
                      HOT
                    </Badge>
                    {chart.is_featured && (
                      <Crown className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
                    {chart.title}
                  </h3>

                  {/* 작성자 */}
                  <p className="text-xs text-muted-foreground mb-2 truncate">
                    {chart.user_nickname}
                  </p>

                  {/* 통계 */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-3 w-3 text-red-400" />
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
