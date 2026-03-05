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
            {/* 티어 라벨 영역 */}
            <div
              className="relative flex flex-col items-center justify-center shrink-0 w-16 md:w-20"
              style={{
                background: config.gradient,
                boxShadow: config.glow,
              }}
            >
              {/* 광택 효과 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />

              {/* 티어 레터 */}
              <span
                className="font-black relative z-10 text-2xl md:text-3xl text-white"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {tier}급
              </span>

              {/* 아이콘 */}
              {TierIcon && (
                <TierIcon className="mt-0.5 relative z-10 h-4 w-4 md:h-5 md:w-5 text-white/80" />
              )}

              {/* S티어 특별 효과 - 반짝임 */}
              {isSTier && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-purple-200/40 to-transparent skew-x-12" />
                </div>
              )}
            </div>

            {/* 아이템 영역 */}
            <div
              className={`
                flex-1 p-2 md:p-3 min-h-[80px] md:min-h-[90px]
                ${isSTier
                  ? 'bg-gradient-to-r from-purple-50/80 to-violet-50/40 dark:from-purple-950/40 dark:to-violet-950/20'
                  : isATier
                    ? 'bg-gradient-to-r from-blue-50/80 to-sky-50/40 dark:from-blue-950/40 dark:to-sky-950/20'
                    : 'bg-gradient-to-r from-green-50/80 to-emerald-50/40 dark:from-green-950/40 dark:to-emerald-950/20'
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
          <span>S급: 최고</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" style={{ background: TIER_CONFIG.A.gradient }} />
          <span>A급: 우수</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" style={{ background: TIER_CONFIG.B.gradient }} />
          <span>B급: 준수</span>
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
            ? 'border-purple-300/60 shadow-sm shadow-purple-200/30'
            : isATier
              ? 'border-blue-300/60 shadow-sm shadow-blue-200/20'
              : 'border-green-300/60 shadow-sm shadow-green-200/20'
          }
        `}
      >
        {/* S티어 1-3위 순위 뱃지 */}
        {isSTier && rank <= 3 && (
          <div
            className={`
              absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center
              text-[10px] font-bold shadow-sm z-10
              ${rank === 1
                ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 text-white'
                : rank === 2
                  ? 'bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 text-white'
                  : 'bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 text-purple-800'
              }
            `}
          >
            {rank}
          </div>
        )}

        {/* S티어 1위 특별 효과 */}
        {isSTier && rank === 1 && (
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-purple-400 animate-pulse" />
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
