import { Metadata } from 'next';
import { MyTierContent } from './MyTierContent';

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_INFO: Record<string, { name: string; description: string }> = {
  'running-shoes': {
    name: '러닝화',
    description: '나만의 러닝화 계급도를 만들어 보세요! 드래그하여 배치하고 친구들과 공유하세요.',
  },
  'chicken': {
    name: '치킨',
    description: '나만의 치킨 계급도를 만들어 보세요! 드래그하여 배치하고 친구들과 공유하세요.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category] || { name: '제품', description: '나만의 계급도를 만들어보세요!' };

  return {
    title: `나의 ${info.name} 계급도 만들기 | 계급도`,
    description: info.description,
    openGraph: {
      title: `나의 ${info.name} 계급도 만들기`,
      description: info.description,
      images: [`/api/og?type=default&title=나의 ${info.name} 계급도&category=${category}`],
    },
  };
}

export default async function MyTierPage({ params }: Props) {
  const { category } = await params;

  return <MyTierContent category={category} />;
}
