import { Metadata } from 'next';
import { CategoryLandingContent } from './CategoryLandingContent';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  'running-shoes': {
    name: '러닝화',
    description: '러닝화 브랜드 계급도 - 커뮤니티 리뷰 기반 S~B 등급 분류',
  },
  'chicken': {
    name: '치킨',
    description: '치킨 메뉴 계급도 - 커뮤니티 리뷰 기반 S~B 등급 분류',
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] || { name: '계급도', description: '커뮤니티 리뷰 기반 계급도' };

  return {
    title: `${meta.name} 계급도 | 계급도`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  return <CategoryLandingContent category={category} />;
}
