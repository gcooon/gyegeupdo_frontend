import { Suspense } from 'react';
import { Metadata } from 'next';
import { ColosseumContent } from './ColosseumContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '콜로세움 - 등급 이의제기 투표',
    description: '커뮤니티 투표로 제품 등급을 조정하세요. 활성화된 이의제기에 참여하여 공정한 등급 결정에 기여하세요.',
    path: '/community/colosseum',
  }),
};

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function ColosseumPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '커뮤니티', path: '/community' },
    { name: '콜로세움', path: '/community/colosseum' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Suspense fallback={<LoadingFallback />}>
          <ColosseumContent />
        </Suspense>
      </div>
    </>
  );
}
