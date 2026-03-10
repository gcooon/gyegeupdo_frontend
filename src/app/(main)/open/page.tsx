import { Metadata } from 'next';
import { MyTierListContent } from './MyTierListContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '오픈 계급도 - 사용자들이 만든 순위표',
    description: '라면, 커피, 배달앱 등 사용자들이 직접 만든 계급도를 둘러보고, 나만의 계급도를 만들어보세요!',
    path: '/open',
  }),
  keywords: ['오픈 계급도', '계급도 만들기', '나만의 순위', '티어 리스트', '사용자 계급도'],
};

export default function OpenTierListPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '오픈 계급도', path: '/open' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MyTierListContent />
    </>
  );
}
