import { Metadata } from 'next';
import { Suspense } from 'react';
import { TierPageContent } from './TierPageContent';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ category: string }>;
}

const categoryMeta: Record<string, { name: string; description: string }> = {
  'running-shoes': {
    name: '러닝화',
    description: '나이키, 아식스, 호카, 뉴발란스 등 러닝화 브랜드',
  },
  'padding': {
    name: '패딩',
    description: '노스페이스, 디스커버리 등 패딩 브랜드',
  },
  'chicken': {
    name: '치킨',
    description: 'BBQ, 교촌, 굽네 등 치킨 브랜드',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category] || { name: '제품', description: '브랜드 계급도' };

  return {
    title: `${meta.name} 브랜드 계급도 2026 — S/A/B/C/D 티어 순위`,
    description: `${meta.description}의 2026년 최신 계급도. 라인업, 기술력, 내구성, 커뮤니티 점수 기반 종합 티어 평가.`,
    openGraph: {
      title: `${meta.name} 브랜드 계급도 2026`,
      description: `${meta.description} S/A/B/C/D 티어 순위 확인하기`,
      images: [{ url: `/og/${category}-tier.png`, width: 1200, height: 630 }],
    },
  };
}

function TierSkeleton() {
  return (
    <div className="space-y-6">
      {['S', 'A', 'B', 'C', 'D'].map((tier) => (
        <div key={tier} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function TierPage({ params }: PageProps) {
  const { category } = await params;
  const meta = categoryMeta[category];

  if (!meta) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{meta.name} 브랜드 계급도</h1>
        <p className="text-muted-foreground">
          라인업, 기술력, 내구성, 커뮤니티 평점을 종합한 2026년 {meta.name} 브랜드 순위
        </p>
      </div>

      <Suspense fallback={<TierSkeleton />}>
        <TierPageContent category={category} />
      </Suspense>
    </div>
  );
}
