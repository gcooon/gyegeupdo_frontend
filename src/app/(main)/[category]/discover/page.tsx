import { Metadata } from 'next';
import { DiscoverContent } from './DiscoverContent';
import { fetchCategory } from '@/lib/category-config';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await fetchCategory(category);
  const name = categoryData?.name || '제품';
  const description = `스와이프로 마음에 드는 ${name}를 찾아보세요! 좌우로 밀어서 취향을 알려주세요.`;

  return {
    title: `${name} 발견하기 | 티어차트 계급도`,
    description,
  };
}

export default async function DiscoverPage({ params }: Props) {
  const { category } = await params;

  return <DiscoverContent category={category} />;
}
