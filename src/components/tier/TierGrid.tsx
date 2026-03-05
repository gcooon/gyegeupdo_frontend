'use client';

import { TierLevel, TIER_CONFIG } from '@/lib/tier';
import { Brand } from '@/types/model';
import { Crown, Medal, Award, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TierGridProps {
  brands: Brand[];
  category?: string;
}

// 티어별 아이콘
const TIER_ICONS: Record<TierLevel, React.ElementType | null> = {
  S: Crown,
  A: Medal,
  B: Award,
  C: Star,
  D: null,
};

export function TierGrid({ brands, category }: TierGridProps) {
  // S~B 티어만 표시 (커뮤니티 리뷰 기반이므로)
  const tiers: TierLevel[] = ['S', 'A', 'B'];

  const brandsByTier = tiers.reduce(
    (acc, tier) => {
      acc[tier] = brands
        .filter((brand) => brand.tier === tier)
        .sort((a, b) => b.tier_score - a.tier_score);
      return acc;
    },
    {} as Record<TierLevel, Brand[]>
  );

  return (
    <div className="space-y-1">
      {tiers.map((tier) => {
        const config = TIER_CONFIG[tier];
        const TierIcon = TIER_ICONS[tier];
        const isSTier = tier === 'S';
        const isATier = tier === 'A';

        return (
          <div
            key={tier}
            className={`
              relative flex overflow-hidden
              ${isSTier ? 'rounded-t-2xl' : ''}
              ${tier === 'B' ? 'rounded-b-2xl' : ''}
            `}
          >
            {/* 티어 라벨 영역 - TierMaker 스타일 */}
            <div
              className="relative flex flex-col items-center justify-center shrink-0 w-16 md:w-20"
              style={{
                background: config.gradient,
              }}
            >
              {/* 광택 효과 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

              {/* 티어 레터 */}
              <span className="font-black text-white drop-shadow-lg relative z-10 text-3xl md:text-4xl">
                {tier}
              </span>

              {/* 아이콘 */}
              {TierIcon && (
                <TierIcon className="text-white/80 mt-0.5 relative z-10 h-4 w-4 md:h-5 md:w-5" />
              )}

              {/* S티어 특별 효과 - 반짝임 */}
              {isSTier && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                </div>
              )}
            </div>

            {/* 아이템 영역 */}
            <div
              className={`
                flex-1 p-2 md:p-3 min-h-[80px] md:min-h-[90px]
                ${isSTier
                  ? 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10'
                  : isATier
                    ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-900/30'
                    : 'bg-gradient-to-r from-orange-50/80 to-orange-50/30 dark:from-orange-950/20 dark:to-orange-950/10'
                }
              `}
            >
              {brandsByTier[tier].length > 0 ? (
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {brandsByTier[tier].map((brand, index) => (
                    <TierItem
                      key={brand.id}
                      brand={brand}
                      category={category}
                      tier={tier}
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground text-sm">
                  해당 티어에 항목이 없습니다
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 범례/설명 */}
      <div className="flex items-center justify-center gap-4 md:gap-6 pt-3 text-[10px] md:text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" style={{ background: TIER_CONFIG.S.gradient }} />
          <span>S: 최고</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" style={{ background: TIER_CONFIG.A.gradient }} />
          <span>A: 우수</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" style={{ background: TIER_CONFIG.B.gradient }} />
          <span>B: 준수</span>
        </div>
      </div>
    </div>
  );
}

// 개별 티어 아이템 컴포넌트 - 단순화된 버전
interface TierItemProps {
  brand: Brand;
  category?: string;
  tier: TierLevel;
  rank: number;
}

function TierItem({ brand, category, tier, rank }: TierItemProps) {
  const isSTier = tier === 'S';
  const isATier = tier === 'A';

  // 카테고리에 따른 링크 경로 결정
  const href = category === 'chicken'
    ? `/${category}/model/${brand.slug}`
    : category
      ? `/${category}/brand/${brand.slug}`
      : `/brand/${brand.slug}`;

  return (
    <Link href={href} className="group">
      <div
        className={`
          relative flex flex-col items-center p-1.5 md:p-2 rounded-lg
          bg-white dark:bg-slate-800/80
          border transition-all duration-200
          hover:shadow-md hover:-translate-y-0.5 hover:border-accent
          w-[70px] md:w-[80px]
          ${isSTier
            ? 'border-amber-300/70 shadow-sm'
            : isATier
              ? 'border-slate-200/70 dark:border-slate-600/70'
              : 'border-orange-200/70 dark:border-orange-800/50'
          }
        `}
      >
        {/* S티어 1-3위 순위 뱃지 */}
        {isSTier && rank <= 3 && (
          <div
            className={`
              absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center
              text-[10px] font-bold text-white shadow-sm z-10
              ${rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 'bg-gradient-to-br from-amber-600 to-amber-800'}
            `}
          >
            {rank}
          </div>
        )}

        {/* S티어 1위 특별 효과 */}
        {isSTier && rank === 1 && (
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
        )}

        {/* 로고/이미지 */}
        <div className="relative rounded-full bg-muted/50 flex items-center justify-center overflow-hidden shrink-0 w-10 h-10 md:w-11 md:h-11">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              fill
              className="object-contain p-1.5"
            />
          ) : (
            <span className="font-bold text-muted-foreground text-sm md:text-base">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>

        {/* 이름만 표시 - 깔끔하게 */}
        <h3 className="font-medium text-center group-hover:text-accent transition-colors line-clamp-2 text-[10px] md:text-[11px] leading-tight mt-1 px-0.5">
          {brand.name}
        </h3>
      </div>
    </Link>
  );
}
