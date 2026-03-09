'use client';

import { TierLevel, TIER_CONFIG } from '@/lib/tier';
import { Brand } from '@/types/model';
import Link from 'next/link';
import { getCategoryConfig, getBrandHref, DEFAULT_BRAND_TIERS } from '@/config/categories';

interface TierGridProps {
  brands: Brand[];
  category?: string;
}

export function TierGrid({ brands, category }: TierGridProps) {
  // 카테고리 설정에서 티어 범위 가져오기 (기본: S~B)
  const categoryConfig = category ? getCategoryConfig(category) : undefined;
  const tiers: TierLevel[] = categoryConfig?.tierChart.brandTiers ?? DEFAULT_BRAND_TIERS;

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
    <div className="space-y-0">
      {tiers.map((tier, index) => {
        const config = TIER_CONFIG[tier];
        const isFirstTier = index === 0;
        const isLastTier = index === tiers.length - 1;

        return (
          <div
            key={tier}
            className={`
              flex border-b last:border-b-0
              ${isFirstTier ? 'rounded-t-xl overflow-hidden' : ''}
              ${isLastTier ? 'rounded-b-xl overflow-hidden' : ''}
            `}
          >
            {/* 티어 라벨 영역 - 용도별 계급도와 동일한 스타일 */}
            <div
              className="w-16 shrink-0 flex items-center justify-center"
              style={{
                backgroundColor: config.color,
              }}
            >
              <span className={`text-lg font-black ${tier === 'S' ? 'text-black' : 'text-white'}`}>
                {config.label}
              </span>
            </div>

            {/* 아이템 영역 */}
            <div className="flex-1 p-2 bg-muted/30 flex flex-wrap gap-1.5 min-h-[60px] items-center">
              {brandsByTier[tier].length > 0 ? (
                brandsByTier[tier].map((brand, brandIndex) => (
                  <TierItem
                    key={brand.id}
                    brand={brand}
                    category={category}
                    tier={tier}
                    rank={brandIndex + 1}
                  />
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">해당 티어에 항목이 없습니다</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 개별 티어 아이템 컴포넌트 - 용도별 계급도와 동일한 스타일
interface TierItemProps {
  brand: Brand;
  category?: string;
  tier: TierLevel;
  rank: number;
}

function TierItem({ brand, category }: TierItemProps) {
  // 중앙 설정에서 링크 경로 결정 (하드코딩 제거)
  const href = category
    ? getBrandHref(category, brand.slug)
    : `/brand/${brand.slug}`;

  return (
    <Link href={href} className="group">
      <div className="bg-card border rounded-lg px-3 py-2 hover:border-accent hover:shadow-md transition-all">
        <p className="font-medium text-sm group-hover:text-accent transition-colors line-clamp-1">
          {brand.name}
        </p>
      </div>
    </Link>
  );
}
