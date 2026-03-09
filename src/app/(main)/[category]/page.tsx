import { Metadata } from 'next';
import { CategoryLandingContent } from './CategoryLandingContent';
import { generateSeoMeta } from '@/lib/seo';
import { fetchCategory } from '@/lib/category-config';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await fetchCategory(category);

  const name = categoryData?.name || '계급도';
  const icon = categoryData?.icon || '🏆';
  const description = categoryData?.display_config?.heroSubDescription ||
    `${name} 계급도 - 커뮤니티 리뷰 기반 S~D 등급 순위. 브랜드와 제품을 비교해보세요.`;
  const keywords = [`${name} 추천`, `${name} 순위`, `${name} 비교`, `${name} 계급도`];

  return {
    ...generateSeoMeta({
      title: `${name} 계급도 - 브랜드별 순위 비교 2026`,
      description,
      path: `/${category}`,
      image: `/api/og?title=${encodeURIComponent(name + ' 계급도')}&category=${category}`,
    }),
    keywords,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // SSR에서 초기 데이터를 가져오지 않음
  // 클라이언트 컴포넌트에서 TanStack Query로 데이터 페칭
  return (
    <CategoryLandingContent
      category={category}
    />
  );
}
