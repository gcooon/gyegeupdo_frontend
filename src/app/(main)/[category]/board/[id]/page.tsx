import { Metadata } from 'next';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BoardPostDetailContent } from './BoardPostDetailContent';
import { fetchCategory } from '@/lib/category-config';
import { fetchPost, fetchPostComments } from '@/lib/server-fetch';

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, id } = await params;
  const [postData, categoryData] = await Promise.all([
    fetchPost(id),
    fetchCategory(category),
  ]);
  const categoryName = categoryData?.name || '계급도';

  if (postData && typeof postData === 'object' && 'title' in postData) {
    const post = postData as { title: string; content: string };
    return {
      title: `${post.title} — ${categoryName} 게시판`,
      description: post.content?.slice(0, 160) || '게시글 상세 내용을 확인하세요.',
    };
  }

  return {
    title: `게시글 #${id} — ${categoryName} 게시판`,
    description: '게시글 상세 내용을 확인하세요.',
  };
}

function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
      <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
      <div className="space-y-3 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function BoardPostDetailPage({ params }: PageProps) {
  const { category, id } = await params;

  // SSR prefetch: 게시글 + 댓글 + 카테고리를 서버에서 미리 가져옴
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
      staleTime: 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['post-comments', id, 1],
      queryFn: () => fetchPostComments(id),
      staleTime: 30 * 1000,
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
        <Suspense fallback={<PostDetailSkeleton />}>
          <BoardPostDetailContent category={category} postId={id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
