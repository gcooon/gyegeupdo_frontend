import { Metadata } from 'next';
import { Suspense } from 'react';
import { BoardContent } from './BoardContent';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { name: string }> = {
  'running-shoes': { name: '러닝화' },
  'chicken': { name: '치킨' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] || { name: '계급도' };

  return {
    title: `${meta.name} 게시판`,
    description: `${meta.name}에 대한 자유로운 이야기와 리뷰를 나눠보세요.`,
  };
}

function BoardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 bg-muted rounded-xl animate-pulse">
          <div className="h-5 w-3/4 bg-muted-foreground/20 rounded mb-2" />
          <div className="h-4 w-1/2 bg-muted-foreground/20 rounded" />
        </div>
      ))}
    </div>
  );
}

export default async function BoardPage({ params }: PageProps) {
  const { category } = await params;

  return (
    <div className="container py-8">
      <Suspense fallback={<BoardSkeleton />}>
        <BoardContent category={category} />
      </Suspense>
    </div>
  );
}
