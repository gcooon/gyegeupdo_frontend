'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Crown, Medal, Award } from 'lucide-react';
import type { TierLevel } from '@/lib/tier';
import { TIER_CONFIG } from '@/lib/tier';

interface TierModel {
  name: string;
  brand: string;
  slug: string;
  score: number;
  upVotes?: number;
  downVotes?: number;
}

interface TierRow {
  tier: TierLevel;
  models: TierModel[];
}

const TIER_ICONS: Record<TierLevel, React.ElementType | null> = {
  S: Crown,
  A: Medal,
  B: Award,
  C: null,
  D: null,
};

const TIER_PREVIEW: TierRow[] = [
  {
    tier: 'S',
    models: [
      { name: '알파플라이 3', brand: '나이키', slug: 'alphafly-3', score: 96, upVotes: 45, downVotes: 8 },
      { name: '메타스피드 스카이+', brand: '아식스', slug: 'metaspeed-sky-plus', score: 95, upVotes: 38, downVotes: 5 },
      { name: '젤 카야노 31', brand: '아식스', slug: 'gel-kayano-31', score: 94, upVotes: 52, downVotes: 12 },
    ],
  },
  {
    tier: 'A',
    models: [
      { name: '노바블라스트 5', brand: '아식스', slug: 'novablast-5', score: 88, upVotes: 73, downVotes: 12 },
      { name: '클리프톤 10', brand: '호카', slug: 'clifton-10', score: 87, upVotes: 28, downVotes: 45 },
      { name: '봄머 v3', brand: '호카', slug: 'bondi-v3', score: 86, upVotes: 31, downVotes: 18 },
      { name: '울트라부스트 라이트', brand: '아디다스', slug: 'ultraboost-light', score: 85, upVotes: 22, downVotes: 15 },
    ],
  },
  {
    tier: 'B',
    models: [
      { name: '페가수스 41', brand: '나이키', slug: 'pegasus-41', score: 82, upVotes: 19, downVotes: 28 },
      { name: '1080v14', brand: '뉴발란스', slug: '1080v14', score: 80, upVotes: 25, downVotes: 11 },
      { name: '킨바라 15', brand: '써코니', slug: 'kinvara-15', score: 78, upVotes: 18, downVotes: 9 },
    ],
  },
];

export function TierPreviewSection() {
  return (
    <section className="py-12 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">러닝화 계급도</h2>
            <p className="text-muted-foreground">커뮤니티 리뷰 기반</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/running-shoes/tier">전체 계급도 보기</Link>
          </Button>
        </div>

        {/* TierMaker 스타일 계급도 */}
        <div className="space-y-1 rounded-2xl overflow-hidden shadow-lg">
          {TIER_PREVIEW.map((row) => {
            const config = TIER_CONFIG[row.tier];
            const TierIcon = TIER_ICONS[row.tier];
            const isSTier = row.tier === 'S';
            const isATier = row.tier === 'A';

            return (
              <div
                key={row.tier}
                className="flex"
              >
                {/* 티어 라벨 - 강한 색상 */}
                <div
                  className="relative flex flex-col items-center justify-center shrink-0 w-16 md:w-24"
                  style={{ background: config.gradient }}
                >
                  {/* 광택 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

                  <span className="font-black text-white drop-shadow-lg relative z-10 text-3xl md:text-4xl">
                    {row.tier}
                  </span>

                  {TierIcon && (
                    <TierIcon className="text-white/80 mt-0.5 relative z-10 h-4 w-4 md:h-5 md:w-5" />
                  )}

                  {/* S티어 반짝임 효과 */}
                  {isSTier && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -inset-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                    </div>
                  )}
                </div>

                {/* 모델 카드들 */}
                <div
                  className={`
                    flex-1 p-2 md:p-3 overflow-x-auto
                    ${isSTier
                      ? 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10'
                      : isATier
                        ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-900/30'
                        : 'bg-gradient-to-r from-orange-50/80 to-orange-50/30 dark:from-orange-950/20 dark:to-orange-950/10'
                    }
                  `}
                >
                  <div className="flex gap-2 md:gap-3">
                    {row.models.map((model, index) => (
                      <TierModelCard
                        key={model.slug}
                        model={model}
                        tier={row.tier}
                        rank={index + 1}
                      />
                    ))}

                    {/* 더보기 버튼 */}
                    <Link
                      href={`/running-shoes/tier?tier=${row.tier}`}
                      className="shrink-0 self-center"
                    >
                      <div className="px-4 py-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground text-sm hover:border-accent hover:text-accent transition-colors">
                        더보기 →
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 간단한 범례 */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.S.gradient }} />
            <span>S: 최고</span>
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
    </section>
  );
}

// 모델 카드 컴포넌트
interface TierModelCardProps {
  model: TierModel;
  tier: TierLevel;
  rank: number;
}

function TierModelCard({ model, tier, rank }: TierModelCardProps) {
  const isSTier = tier === 'S';
  const isATier = tier === 'A';

  const handleVoteClick = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.preventDefault();
    e.stopPropagation();
    toast.warning(`${model.name}에 ${voteType === 'up' ? 'UP' : 'DOWN'} 투표하려면 로그인이 필요합니다.`);
  };

  return (
    <Link
      href={`/running-shoes/model/${model.slug}`}
      className="group shrink-0"
    >
      <div
        className={`
          relative flex flex-col items-center p-2 md:p-3 rounded-xl
          bg-white dark:bg-slate-800/80
          border-2 transition-all duration-200
          hover:shadow-lg hover:-translate-y-1 hover:border-accent
          w-[90px] md:w-[100px] h-[130px] md:h-[150px]
          ${isSTier
            ? 'border-amber-300 shadow-md'
            : isATier
              ? 'border-slate-200 dark:border-slate-600'
              : 'border-orange-200 dark:border-orange-800/50'
          }
        `}
      >
        {/* S티어 순위 뱃지 */}
        {isSTier && rank <= 3 && (
          <div
            className={`
              absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center
              text-[10px] md:text-xs font-bold text-white shadow-md
              ${rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-slate-400' : 'bg-amber-700'}
            `}
          >
            {rank}
          </div>
        )}

        {/* 아이콘/로고 */}
        <div className="rounded-full bg-muted flex items-center justify-center shrink-0 w-9 h-9 md:w-10 md:h-10">
          <span className="text-base md:text-lg">👟</span>
        </div>

        {/* 브랜드 + 모델명 - 고정 높이 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center mt-1">
          <p className="text-[9px] md:text-[10px] text-muted-foreground">{model.brand}</p>
          <p className="font-semibold text-center line-clamp-2 w-full group-hover:text-accent transition-colors text-[10px] md:text-xs leading-tight">
            {model.name}
          </p>
        </div>

        {/* 점수 */}
        <p
          className={`
            font-bold text-[10px] shrink-0
            ${isSTier ? 'text-amber-600' : isATier ? 'text-slate-500' : 'text-orange-600/80'}
          `}
        >
          {model.score}점
        </p>

        {/* 투표 버튼 */}
        <div className="flex items-center gap-0.5 mt-1 shrink-0">
          <button
            onClick={(e) => handleVoteClick(e, 'up')}
            className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
            title="등급 상향"
          >
            <ChevronUp className="h-2.5 w-2.5" />
            <span>{model.upVotes || 0}</span>
          </button>
          <button
            onClick={(e) => handleVoteClick(e, 'down')}
            className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
            title="등급 하향"
          >
            <ChevronDown className="h-2.5 w-2.5" />
            <span>{model.downVotes || 0}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
