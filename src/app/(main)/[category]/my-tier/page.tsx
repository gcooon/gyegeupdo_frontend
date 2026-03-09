import { Metadata } from 'next';
import { MyTierContent } from './MyTierContent';
import { fetchCategory } from '@/lib/category-config';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await fetchCategory(category);
  const name = categoryData?.name || '제품';
  const description = `나만의 ${name} 계급도를 만들어 보세요! 드래그하여 배치하고 친구들과 공유하세요.`;

  return {
    title: `나의 ${name} 계급도 만들기`,
    description,
    openGraph: {
      title: `나의 ${name} 계급도 만들기`,
      description,
      images: [`/api/og?type=default&title=나의 ${name} 계급도&category=${category}`],
    },
  };
}

export default async function MyTierPage({ params }: Props) {
  const { category } = await params;

  return <MyTierContent category={category} />;
}
