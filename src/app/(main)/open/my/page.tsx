import { Metadata } from 'next';
import { MyTierListContent } from '../MyTierListContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '내 계급도 - 내가 만든 순위표',
    description: '내가 직접 만든 계급도를 확인하고 관리하세요.',
    path: '/open/my',
  }),
};

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
      <MyTierListContent initialTab="mine" />
    </>
  );
}
