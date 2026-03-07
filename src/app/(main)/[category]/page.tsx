import { Metadata } from 'next';
import { CategoryLandingContent } from './CategoryLandingContent';
import { generateSeoMeta } from '@/lib/seo';
import { getMockBrands, getMockCategory } from '@/lib/mockData';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { name: string; emoji: string; description: string; keywords: string[] }> = {
  'running-shoes': {
    name: '러닝화',
    emoji: '👟',
    description: '러닝화 브랜드 계급도 - 나이키, 아디다스, 뉴발란스 등 커뮤니티 리뷰 기반 S~D 등급 순위. 3분 진단으로 나에게 맞는 러닝화를 찾아보세요.',
    keywords: ['러닝화 추천', '러닝화 순위', '러닝화 비교', '러닝화 계급도', '러닝화 브랜드 순위'],
  },
  'chicken': {
    name: '치킨',
    emoji: '🍗',
    description: '치킨 메뉴 계급도 - 커뮤니티 리뷰 기반 S~D 등급 순위. 인기 치킨 브랜드와 메뉴를 비교해보세요.',
    keywords: ['치킨 추천', '치킨 순위', '치킨 브랜드 비교', '치킨 계급도'],
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] || {
    name: '계급도',
    emoji: '🏆',
    description: '커뮤니티 리뷰 기반 계급도',
    keywords: ['계급도', '순위', '추천'],
  };

  return {
    ...generateSeoMeta({
      title: `${meta.name} 계급도 - 브랜드별 순위 비교 2026`,
      description: meta.description,
      path: `/${category}`,
      image: `/api/og?title=${encodeURIComponent(meta.name + ' 계급도')}&category=${category}`,
    }),
    keywords: meta.keywords,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const initialBrands = getMockBrands(category) || undefined;
  const initialCategory = getMockCategory(category) || undefined;

  return (
    <CategoryLandingContent
      category={category}
      initialBrands={initialBrands}
      initialCategory={initialCategory}
    />
  );
}
