'use client';

import Link from 'next/link';
import { useBrand, useBrandProducts, useCategory } from '@/hooks/useBrands';
import { TierBadge } from '@/components/tier/TierBadge';
import { ModelTierCard } from '@/components/model/ModelTierCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  category: string;
  slug: string;
  initialBrand?: import('@/types/model').Brand;
  initialCategory?: import('@/types/model').Category;
}

export function BrandDetailContent({ category, slug, initialBrand, initialCategory }: Props) {
  const { data: brand = initialBrand, isLoading: brandLoading, error: brandError } = useBrand(slug, initialBrand);
  const { data: products, isLoading: productsLoading } = useBrandProducts(slug);
  const { data: categoryData = initialCategory } = useCategory(category, initialCategory);

  if (brandLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">브랜드 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (brandError || !brand) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">브랜드를 찾을 수 없습니다.</p>
        <Button asChild className="mt-4">
          <Link href={`/${category}/tier`}>브랜드 목록으로</Link>
        </Button>
      </div>
    );
  }

  // 카테고리 정의에서 점수 기준 가져오기
  const brandScoreDefinitions = categoryData?.brand_score_definitions || [
    { key: 'lineup', label: '라인업', weight: 25 },
    { key: 'tech', label: '기술력', weight: 30 },
    { key: 'durability', label: '내구성', weight: 25 },
    { key: 'community', label: '커뮤니티', weight: 20 },
  ];

  const brandScores: Record<string, number> = {
    lineup_score: brand.lineup_score ?? 0,
    tech_score: brand.tech_score ?? 0,
    durability_score: brand.durability_score ?? 0,
    community_score: brand.community_score ?? 0,
  };

  const scores = brandScoreDefinitions.map((def) => ({
    label: def.label,
    value: brandScores[`${def.key}_score`] ?? 0,
    weight: `${def.weight}%`,
  }));

  return (
    <div className="space-y-8">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="w-20 h-20 object-contain" />
          ) : (
            <span className="text-3xl font-bold text-muted-foreground">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <TierBadge tier={brand.tier} size="lg" />
          </div>
          <p className="text-muted-foreground">{brand.description || `${categoryData?.name || '제품'} 브랜드`}</p>
          <p className="text-lg font-semibold text-primary mt-2">
            종합 점수: {brand.tier_score.toFixed(1)}점
          </p>
        </div>
      </div>

      {/* Score Cards */}
      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(scores.length, 4)} gap-4`}>
        {scores.map((score) => (
          <Card key={score.label} className="card-base">
            <CardContent className="py-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">{score.label}</p>
              <p className="text-2xl font-bold">{score.value.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">가중치 {score.weight}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score Bar Chart */}
      <Card className="card-base">
        <CardHeader>
          <CardTitle>세부 점수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scores.map((score) => (
              <div key={score.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{score.label}</span>
                  <span className="font-medium">{score.value.toFixed(1)}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${score.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{brand.name} 제품</h2>
          {products && <span className="text-muted-foreground">{products.length}개 제품</span>}
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ModelTierCard key={product.id} model={product} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            등록된 제품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
