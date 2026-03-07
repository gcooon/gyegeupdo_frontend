import { Metadata } from 'next';
import { MyTierListContent } from './MyTierListContent';
import { generateSeoMeta } from '@/lib/seo';
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from '@/lib/jsonLd';
import { getMockUserTierCharts } from '@/lib/mockUserTierCharts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tier-chart.com';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '내가 만든 계급도 - 사용자 순위표 모음',
    description: '라면, 커피, 배달앱 등 사용자들이 직접 만든 계급도를 둘러보고, 나만의 계급도를 만들어보세요!',
    path: '/my-tier',
  }),
  keywords: ['계급도 만들기', '나만의 순위', '티어 리스트', '사용자 계급도'],
};

export default function MyTierListPage() {
  const itemListJsonLd = generateItemListJsonLd([
    { name: '라면 계급도', url: `${SITE_URL}/my-tier/ramen-tier`, position: 1 },
    { name: '커피 프랜차이즈 순위', url: `${SITE_URL}/my-tier/coffee-franchise-tier`, position: 2 },
    { name: '배달앱 순위', url: `${SITE_URL}/my-tier/delivery-app-tier`, position: 3 },
    { name: '편의점 도시락 티어', url: `${SITE_URL}/my-tier/convenience-store-dosirak-tier`, position: 4 },
  ]);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '내가 만든 계급도', path: '/my-tier' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MyTierListContent initialCharts={getMockUserTierCharts().items} />
    </>
  );
}
