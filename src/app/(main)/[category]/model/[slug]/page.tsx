import { Metadata } from 'next';
import { Suspense } from 'react';
import { ModelDetailContent } from './ModelDetailContent';
import { getMockProduct } from '@/lib/mockProducts';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const mockProduct = getMockProduct(slug);

  const modelName = mockProduct
    ? `${mockProduct.brand.name} ${mockProduct.name}`
    : slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const description = mockProduct
    ? `${modelName} ${mockProduct.tier}티어 — ${mockProduct.review_count}개 후기 종합. 상세 스펙과 실제 리뷰.`
    : `${modelName} 스펙, 성능, 종합 후기. 상세 정보와 나와 비슷한 사용자들의 실제 리뷰.`;

  return {
    title: `${modelName} 계급도 스펙 후기 — 2026`,
    description,
    openGraph: {
      title: `${modelName} — 계급도`,
      description,
      images: [{ url: `/api/og?model=${slug}`, width: 1200, height: 630 }],
    },
  };
}

function ModelSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="h-64 bg-muted rounded-xl animate-pulse" />
      <div className="h-48 bg-muted rounded-xl animate-pulse" />
    </div>
  );
}

export default async function ModelDetailPage({ params }: Props) {
  const { category, slug } = await params;

  return (
    <div className="container py-8">
      <Suspense fallback={<ModelSkeleton />}>
        <ModelDetailContent
          category={category}
          slug={slug}
          initialProduct={getMockProduct(slug) || undefined}
        />
      </Suspense>
    </div>
  );
}
