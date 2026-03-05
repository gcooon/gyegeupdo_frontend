'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { SwipeCard } from '@/components/swipe/SwipeCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { RUNNING_SHOES_PRODUCTS, CHICKEN_PRODUCTS } from '@/lib/mockProducts';
import type { TierLevel } from '@/lib/tier';

interface DiscoverContentProps {
  category: string;
}

const CATEGORY_INFO: Record<string, { name: string; emoji: string }> = {
  'running-shoes': { name: '러닝화', emoji: '👟' },
  'chicken': { name: '치킨', emoji: '🍗' },
};

export function DiscoverContent({ category }: DiscoverContentProps) {
  const info = CATEGORY_INFO[category] || { name: '제품', emoji: '🏆' };

  // 카테고리별 아이템 로드
  const items = useMemo(() => {
    const products = category === 'running-shoes'
      ? Object.values(RUNNING_SHOES_PRODUCTS)
      : category === 'chicken'
        ? Object.values(CHICKEN_PRODUCTS)
        : [];

    // 랜덤 셔플
    const shuffled = [...products].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 10).map((item) => ({
      id: item.slug,
      name: item.name,
      brand: item.brand.name,
      imageUrl: item.image_url || undefined,
      tier: item.tier as TierLevel,
      tierScore: item.tier_score,
      description: item.description,
      slug: item.slug,
    }));
  }, [category]);

  const handleComplete = (
    liked: Array<{ id: string; name: string }>,
    passed: Array<{ id: string; name: string }>
  ) => {
    // 결과를 로컬 스토리지에 저장
    try {
      const existing = JSON.parse(localStorage.getItem(`discover-${category}`) || '[]');
      const newLiked = liked.map((item) => item.id);
      const uniqueLiked = [...new Set([...existing, ...newLiked])];
      localStorage.setItem(`discover-${category}`, JSON.stringify(uniqueLiked));
    } catch {
      // 저장 실패 시 무시
    }
  };

  return (
    <div className="container py-6 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${category}/tier`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            돌아가기
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-medium">{info.name} 발견하기</span>
        </div>
        <div className="w-20" /> {/* 레이아웃 균형용 */}
      </div>

      {/* 스와이프 카드 */}
      {items.length > 0 ? (
        <SwipeCard items={items} category={category} onComplete={handleComplete} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>표시할 항목이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
