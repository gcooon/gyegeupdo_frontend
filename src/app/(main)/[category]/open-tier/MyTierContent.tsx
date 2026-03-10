'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { TierMaker } from '@/components/tier-maker/TierMaker';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useCategoryProducts } from '@/hooks/useModels';
import { useCategory } from '@/hooks/useBrands';
import { getCategoryInfo } from '@/config/categories';
import type { TierLevel } from '@/lib/tier';

interface MyTierContentProps {
  category: string;
}

export function MyTierContent({ category }: MyTierContentProps) {
  const { data: categoryData } = useCategory(category);
  const info = getCategoryInfo(categoryData || category);

  // API에서 카테고리별 제품 가져오기
  const { data: products = [], isLoading } = useCategoryProducts(category);

  // 카테고리별 아이템 로드
  const initialItems = useMemo(() => {
    return products.map((item) => ({
      id: item.slug,
      name: item.name,
      brand: item.brand?.name || '',
      imageUrl: item.image_url || undefined,
      tier: null as TierLevel | null,
    }));
  }, [products]);

  const handleSave = (items: Array<{ id: string; name: string; brand: string; tier: TierLevel | null }>) => {
    // 로컬 스토리지에 저장
    try {
      localStorage.setItem(`my-tier-${category}`, JSON.stringify(items));
    } catch {
      // 저장 실패 시 무시
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">제품 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      {/* 뒤로가기 */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${category}/tier`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {info.icon} {info.name} 계급도로 돌아가기
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
