import { Metadata } from 'next';
import { Suspense } from 'react';
import { CompareContent } from './CompareContent';
import { getMockProduct } from '@/lib/mockProducts';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ models?: string }>;
}

const CATEGORY_META: Record<string, { name: string }> = {
  'running-shoes': { name: '러닝화' },
  'chicken': { name: '치킨' },
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const { models } = await searchParams;
  const categoryName = CATEGORY_META[category]?.name || '제품';
  const slugs = models?.split(',') || [];

  if (slugs.length === 2) {
    const productA = getMockProduct(slugs[0]);
    const productB = getMockProduct(slugs[1]);
    if (productA && productB) {
      return {
        title: `${productA.name} vs ${productB.name} 비교 — ${categoryName}`,
        description: `${productA.brand.name} ${productA.name}(${productA.tier}티어)과 ${productB.brand.name} ${productB.name}(${productB.tier}티어)의 상세 스펙, 점수, 가격 비교.`,
      };
    }
  }

  return {
    title: `${categoryName} 비교`,
    description: `두 ${categoryName} 제품의 스펙, 점수, 가격을 한눈에 비교해보세요.`,
  };
}

function CompareSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ComparePage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { models } = await searchParams;
  const slugs = models?.split(',') || [];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">제품 비교</h1>
      <Suspense fallback={<CompareSkeleton />}>
        <CompareContent category={category} slugs={slugs} />
      </Suspense>
    </div>
  );
}
