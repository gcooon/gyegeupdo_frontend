'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Heart, Eye, MessageCircle, Loader2, Trophy } from 'lucide-react';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import api from '@/lib/api';
import type { UserTierChartListItem, UserTierChartListResponse } from '@/types/tier';
import { useTranslations } from '@/i18n';

export function HallOfFameSection() {
  const [hallOfFameCharts, setHallOfFameCharts] = useState<UserTierChartListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('openHub');
  const tPromotion = useTranslations('promotion');

  useEffect(() => {
    const fetchHallOfFameCharts = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: UserTierChartListResponse | UserTierChartListItem[];
        }>('/tiers/user-charts/hall_of_fame/?limit=6');

        if (response.data.success) {
          const data = response.data.data;
          if (Array.isArray(data)) {
            setHallOfFameCharts(data);
          } else {
            setHallOfFameCharts(data.items);
          }
        }
      } catch {
        setHallOfFameCharts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHallOfFameCharts();
  }, []);

  if (!isLoading && hallOfFameCharts.length === 0) {
    return null;
  }

  const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

  return (
    <section className="py-8 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-orange-500/5 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {t('hallOfFameTitle')}
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs">
                  <Trophy className="h-3 w-3 mr-1" />
                  BEST
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">{tPromotion('hallOfFameDescription')}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="border-amber-500/50 text-amber-600 hover:bg-amber-50" asChild>
          <Link href="/open?tab=hall_of_fame">
            {t('viewHallOfFame')}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hallOfFameCharts.map((chart) => (
            <Link key={chart.id} href={`/open/${chart.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group cursor-pointer overflow-hidden border-amber-200/50">
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
                  {/* 명예의전당 뱃지 */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] px-1.5 py-0">
                      <Crown className="h-3 w-3 mr-0.5" />
                      BEST
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {chart.item_count}개
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
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
