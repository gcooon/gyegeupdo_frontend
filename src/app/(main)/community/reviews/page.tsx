import { Suspense } from 'react';
import { Metadata } from 'next';
import { ReviewsContent } from './ReviewsContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

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

export default function ReviewsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '커뮤니티', path: '/community' },
    { name: '전체 리뷰', path: '/community/reviews' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Suspense fallback={<LoadingFallback />}>
          <ReviewsContent />
        </Suspense>
      </div>
    </>
  );
}
