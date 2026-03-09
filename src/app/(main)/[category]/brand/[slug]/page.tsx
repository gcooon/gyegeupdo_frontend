import { Metadata } from 'next';
import { Suspense } from 'react';
import { BrandDetailContent } from './BrandDetailContent';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

// slug를 읽기 좋은 이름으로 변환
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brandName = slugToName(slug);
  const description = `${brandName} 전 모델 계급도 및 리뷰. 라인업, 기술력, 내구성, 커뮤니티 평가 종합 점수.`;

  return {
    title: `${brandName} 계급도 — 2026 브랜드 리뷰`,
    description,
    openGraph: {
      title: `${brandName} — 티어차트 계급도`,
      description,
      images: [{ url: `/api/og?brand=${slug}`, width: 1200, height: 630 }],
    },
  };
}

function BrandSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
        <div className="space-y-3">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function BrandDetailPage({ params }: Props) {
  const { category, slug } = await params;

  return (
    <div className="container py-8">
      <Suspense fallback={<BrandSkeleton />}>
        <BrandDetailContent
          category={category}
          slug={slug}
        />
      </Suspense>
    </div>
  );
}
