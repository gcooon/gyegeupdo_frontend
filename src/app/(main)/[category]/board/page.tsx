import { Metadata } from 'next';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BoardContent } from './BoardContent';
import { fetchCategory } from '@/lib/category-config';
import { fetchPosts } from '@/lib/server-fetch';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await fetchCategory(category);
  const name = categoryData?.name || '계급도';

  return {
    title: `${name} 게시판`,
    description: `${name}에 대한 자유로운 이야기와 리뷰를 나눠보세요.`,
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

  // SSR prefetch: 게시글 목록 + 카테고리를 서버에서 미리 가져옴
  const queryClient = new QueryClient();
  const filters = { category, page: 1 };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['posts', filters],
      queryFn: () => fetchPosts(filters),
      staleTime: 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['category', category],
      queryFn: () => fetchCategory(category),
      staleTime: 5 * 60 * 1000,
    }),
  ]);

  return (
    <div className="container py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<BoardSkeleton />}>
          <BoardContent category={category} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
