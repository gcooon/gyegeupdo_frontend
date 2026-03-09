'use client';

import Link from 'next/link';
import { useUsageProducts } from '@/hooks/useModels';
import { Card, CardContent } from '@/components/ui/card';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import type { Product } from '@/types/model';

interface UsageTierSectionProps {
  category: string;
  usage: {
    key: string;
    label: string;
    description: string;
    icon: string;
  };
}

// 제품을 티어별로 그룹화
function groupProductsByTier(products: Product[]): Record<TierLevel, Product[]> {
  const grouped: Record<TierLevel, Product[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  };

  products.forEach((product) => {
    const tier = product.tier as TierLevel;
    if (grouped[tier]) {
      grouped[tier].push(product);
    }
  });

  // 각 티어 내에서 점수순 정렬
  Object.keys(grouped).forEach((tier) => {
    grouped[tier as TierLevel].sort((a, b) => b.tier_score - a.tier_score);
  });

  return grouped;
}

export function UsageTierSection({ category, usage }: UsageTierSectionProps) {
  const { data: products, isLoading, error } = useUsageProducts(category, usage.key);

  const tiersByUsage = products ? groupProductsByTier(products) : null;
  const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

  return (
    <Card className="card-base overflow-hidden">
      {/* 용도 헤더 */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/5 px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl">
            {usage.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold">{usage.label}</h3>
            <p className="text-sm text-muted-foreground">{usage.description}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        {isLoading ? (
          // 로딩 상태
          <div className="p-8 text-center text-muted-foreground">
            <div className="animate-pulse">데이터를 불러오는 중...</div>
          </div>
        ) : error ? (
          // 에러 상태
          <div className="p-8 text-center text-muted-foreground">
            데이터를 불러올 수 없습니다.
          </div>
        ) : !tiersByUsage || Object.values(tiersByUsage).every((arr) => arr.length === 0) ? (
          // 데이터 없음
          <div className="p-8 text-center text-muted-foreground">
            해당 용도의 제품이 없습니다.
          </div>
        ) : (
          // TierMaker 스타일 티어 행
          tiers.map((tier) => {
            const items = tiersByUsage[tier] || [];
            const config = TIER_CONFIG[tier];

            return (
              <div key={tier} className="flex border-b last:border-b-0">
                {/* 티어 라벨 */}
                <div
                  className="w-16 shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  <span className={`text-lg font-black ${tier === 'S' ? 'text-black' : 'text-white'}`}>
                    {config.label}
                  </span>
                </div>

                {/* 제품 목록 */}
                <div className="flex-1 p-2 bg-muted/30 flex flex-wrap gap-1.5 min-h-[60px] items-center">
                  {items.length === 0 ? (
                    <span className="text-sm text-muted-foreground italic">-</span>
                  ) : (
                    items.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/${category}/model/${product.slug}`}
                        className="group"
                      >
                        <div className="bg-card border rounded-lg px-3 py-2 hover:border-accent hover:shadow-md transition-all">
                          <p className="text-[10px] text-muted-foreground">
                            {product.brand?.name || ''}
                          </p>
                          <p className="font-medium text-sm group-hover:text-accent transition-colors line-clamp-1">
                            {product.name}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
