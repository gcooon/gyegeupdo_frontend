import { Metadata } from 'next';
import { Suspense } from 'react';
import { QuizContent } from './QuizContent';
import { fetchCategory } from '@/lib/category-config';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await fetchCategory(category);
  const name = categoryData?.name || '제품';

  return {
    title: `${name} 추천 테스트 — 나에게 맞는 ${name} 찾기`,
    description: `3분이면 나에게 딱 맞는 ${name}을 찾을 수 있어요. 나와 비슷한 사용자들의 선택을 확인하세요.`,
    openGraph: {
      title: `${name} 추천 테스트`,
      description: `3분이면 나에게 딱 맞는 ${name} 찾기`,
      images: [{ url: `/og/${category}-quiz.png`, width: 1200, height: 630 }],
    },
  };
}

function QuizSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
      <div className="h-4 w-64 bg-muted rounded animate-pulse mx-auto" />
      <div className="space-y-4 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function QuizPage({ params }: PageProps) {
  const { category } = await params;

  return (
    <div className="container py-8">
      <Suspense fallback={<QuizSkeleton />}>
        <QuizContent category={category} />
      </Suspense>
    </div>
  );
}
