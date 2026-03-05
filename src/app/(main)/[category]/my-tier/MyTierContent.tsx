'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { TierMaker } from '@/components/tier-maker/TierMaker';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { RUNNING_SHOES_PRODUCTS, CHICKEN_PRODUCTS } from '@/lib/mockProducts';
import type { TierLevel } from '@/lib/tier';

interface MyTierContentProps {
  category: string;
}

const CATEGORY_INFO: Record<string, { name: string; emoji: string }> = {
  'running-shoes': { name: '러닝화', emoji: '👟' },
  'chicken': { name: '치킨', emoji: '🍗' },
};

export function MyTierContent({ category }: MyTierContentProps) {
  const info = CATEGORY_INFO[category] || { name: '제품', emoji: '🏆' };

  // 카테고리별 아이템 로드
  const initialItems = useMemo(() => {
    if (category === 'running-shoes') {
      return Object.values(RUNNING_SHOES_PRODUCTS).map((item) => ({
        id: item.slug,
        name: item.name,
        brand: item.brand.name,
        imageUrl: item.image_url || undefined,
        tier: null as TierLevel | null,
      }));
    } else if (category === 'chicken') {
      return Object.values(CHICKEN_PRODUCTS).map((item) => ({
        id: item.slug,
        name: item.name,
        brand: item.brand.name,
        imageUrl: item.image_url || undefined,
        tier: null as TierLevel | null,
      }));
    }
    return [];
  }, [category]);

  const handleSave = (items: Array<{ id: string; name: string; brand: string; tier: TierLevel | null }>) => {
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem(`my-tier-${category}`, JSON.stringify(items));
    } catch {
      // 저장 실패 시 무시
    }
  };

  return (
    <div className="container py-6 max-w-4xl">
      {/* 뒤로가기 */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${category}/tier`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {info.emoji} {info.name} 계급도로 돌아가기
          </Link>
        </Button>
      </div>

      {/* TierMaker */}
      <TierMaker
        category={category}
        categoryName={info.name}
        initialItems={initialItems}
        onSave={handleSave}
      />
    </div>
  );
}
