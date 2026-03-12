import { Suspense } from 'react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { MyTierListContent } from '../MyTierListContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '내 계급도 - 내가 만든 순위표',
    description: '내가 직접 만든 계급도를 확인하고 관리하세요.',
    path: '/open/my',
  }),
};

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function MyTierChartsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '오픈 계급도', path: '/open' },
    { name: '내 계급도', path: '/open/my' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <MyTierListContent initialTab="mine" />
      </Suspense>
    </>
  );
}
