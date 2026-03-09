import { Metadata } from 'next';
import { Suspense } from 'react';
import { CompareContent } from './CompareContent';
import { fetchCategory } from '@/lib/category-config';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ models?: string }>;
}

// slug를 읽기 좋은 이름으로 변환
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const { models } = await searchParams;
  const categoryData = await fetchCategory(category);
  const categoryName = categoryData?.name || '제품';
  const slugs = models?.split(',') || [];

  if (slugs.length === 2) {
    const nameA = slugToName(slugs[0]);
    const nameB = slugToName(slugs[1]);
    return {
      title: `${nameA} vs ${nameB} 비교 — ${categoryName}`,
      description: `${nameA}과 ${nameB}의 상세 스펙, 점수, 가격 비교.`,
    };
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
