import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { generateSeoMeta } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/jsonLd';
import { OfficialHubContent } from './OfficialHubContent';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '공식 계급도 - 전체 카테고리',
    description: '러닝화, 치킨, 시계 등 모든 카테고리의 공식 계급도를 한눈에 비교하세요. 커뮤니티 리뷰 기반 S~D 등급 평가.',
    path: '/official',
  }),
  keywords: ['공식 계급도', '카테고리 계급도', '러닝화 계급도', '치킨 계급도', '시계 계급도', '티어리스트'],
};

export default function OfficialTierHubPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '공식 계급도', path: '/official' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <OfficialHubContent />
    </>
  );
}
