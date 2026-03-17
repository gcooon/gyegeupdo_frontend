import { Suspense } from 'react';
import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ReviewsContent } from './ReviewsContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';
import { fetchPosts } from '@/lib/server-fetch';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '커뮤니티 리뷰 - 전체 카테고리 제품 후기',
    description: '러닝화, 치킨, 시계 등 모든 카테고리의 실제 사용자 리뷰를 한 곳에서 확인하세요. 솔직한 후기와 평점으로 현명한 선택을 하세요.',
    path: '/community/reviews',
  }),
};

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default async function ReviewsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '커뮤니티', path: '/community' },
    { name: '전체 리뷰', path: '/community/reviews' },
  ]);

  // SSR prefetch: 클라이언트 훅과 동일한 queryKey로 prefetch
  const queryClient = new QueryClient();
  const filters = { tag: 'product_review', page: 1, page_size: 20 };
  await queryClient.prefetchQuery({
    queryKey: ['posts', filters],
    queryFn: () => fetchPosts(filters),
    staleTime: 60 * 1000,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<LoadingFallback />}>
            <ReviewsContent />
          </Suspense>
        </HydrationBoundary>
      </div>
    </>
  );
}
