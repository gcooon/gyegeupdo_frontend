'use client';

import { TierLevel, TIER_CONFIG } from '@/lib/tier';
import { Brand } from '@/types/model';
import { BrandTierCard } from './BrandTierCard';
import { Crown, Medal, Award, Star } from 'lucide-react';

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
      {tiers.map((tier, tierIndex) => {
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
              className="relative flex flex-col items-center justify-center shrink-0 w-20 md:w-28"
              style={{
                background: config.gradient,
              }}
            >
              {/* 광택 효과 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

              {/* 티어 레터 */}
              <span className="font-black text-white drop-shadow-lg relative z-10 text-4xl md:text-5xl">
                {tier}
              </span>

              {/* 아이콘 */}
              {TierIcon && (
                <TierIcon className="text-white/80 mt-1 relative z-10 h-5 w-5 md:h-6 md:w-6" />
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
                flex-1 p-3 md:p-4
                ${isSTier
                  ? 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10'
                  : isATier
                    ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-900/30'
                    : 'bg-gradient-to-r from-orange-50/80 to-orange-50/30 dark:from-orange-950/20 dark:to-orange-950/10'
                }
              `}
            >
              {brandsByTier[tier].length > 0 ? (
                <div
                  className={`
                    flex flex-wrap gap-2 md:gap-3
                    ${isSTier ? 'gap-3 md:gap-4' : ''}
                  `}
                >
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
                <div className="py-4 md:py-6 text-center text-muted-foreground text-sm">
                  해당 티어에 항목이 없습니다
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 범례/설명 */}
      <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.S.gradient }} />
          <span>S: 최고 등급</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.A.gradient }} />
          <span>A: 우수</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.B.gradient }} />
          <span>B: 준수</span>
        </div>
      </div>
    </div>
  );
}

// 개별 티어 아이템 컴포넌트
interface TierItemProps {
  brand: Brand;
  category?: string;
  tier: TierLevel;
  rank: number;
}

import Link from 'next/link';
import Image from 'next/image';
import { ChevronUp, ChevronDown } from 'lucide-react';

function TierItem({ brand, category, tier, rank }: TierItemProps) {
  const isSTier = tier === 'S';
  const isATier = tier === 'A';

  // 카테고리에 따른 링크 경로 결정
  const href = category === 'chicken'
    ? `/${category}/model/${brand.slug}`
    : category
      ? `/${category}/brand/${brand.slug}`
      : `/brand/${brand.slug}`;

  const handleVoteClick = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.preventDefault();
    e.stopPropagation();
    alert(`${brand.name}에 ${voteType === 'up' ? 'UP' : 'DOWN'} 투표하려면 로그인이 필요합니다.`);
  };

  // Mock vote data
  const votes = {
    upVotes: Math.floor(Math.random() * 50) + 5,
    downVotes: Math.floor(Math.random() * 30) + 2,
  };

  return (
    <Link href={href} className="group">
      <div
        className={`
          relative flex flex-col items-center p-2 md:p-3 rounded-xl
          bg-white dark:bg-slate-800/80
          border-2 transition-all duration-200
          hover:shadow-lg hover:-translate-y-1 hover:border-accent
          w-[100px] md:w-[110px] h-[140px] md:h-[160px]
          ${isSTier
            ? 'border-amber-300 shadow-md'
            : isATier
              ? 'border-slate-200 dark:border-slate-600'
              : 'border-orange-200 dark:border-orange-800/50'
          }
        `}
      >
        {/* 순위 뱃지 (S티어만) */}
        {isSTier && rank <= 3 && (
          <div
            className={`
              absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center
              text-xs font-bold text-white shadow-md
              ${rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-slate-400' : 'bg-amber-700'}
            `}
          >
            {rank}
          </div>
        )}

        {/* 로고/이미지 */}
        <div className="relative rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 w-10 h-10 md:w-12 md:h-12">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <span className="font-bold text-muted-foreground text-base md:text-lg">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>

        {/* 이름 - 고정 높이 영역 */}
        <div className="flex-1 flex items-center justify-center mt-1">
          <h3 className="font-semibold text-center group-hover:text-accent transition-colors line-clamp-2 text-[11px] md:text-xs leading-tight">
            {brand.name}
          </h3>
        </div>

        {/* 점수 */}
        <div
          className={`
            font-bold text-xs shrink-0
            ${isSTier
              ? 'text-amber-600'
              : isATier
                ? 'text-slate-500'
                : 'text-orange-600/80'
            }
          `}
        >
          {brand.tier_score.toFixed(1)}점
        </div>

        {/* 투표 버튼 */}
        <div className="flex items-center gap-1 mt-1 shrink-0">
          <button
            onClick={(e) => handleVoteClick(e, 'up')}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
            title="등급 상향"
          >
            <ChevronUp className="h-3 w-3" />
            <span>{votes.upVotes}</span>
          </button>
          <button
            onClick={(e) => handleVoteClick(e, 'down')}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
            title="등급 하향"
          >
            <ChevronDown className="h-3 w-3" />
            <span>{votes.downVotes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
