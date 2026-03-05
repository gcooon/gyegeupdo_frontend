import { Metadata } from 'next';
import { DiscoverContent } from './DiscoverContent';

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_INFO: Record<string, { name: string; description: string }> = {
  'running-shoes': {
    name: '러닝화',
    description: '스와이프로 마음에 드는 러닝화를 찾아보세요! 좌우로 밀어서 취향을 알려주세요.',
  },
  'chicken': {
    name: '치킨',
    description: '스와이프로 마음에 드는 치킨을 찾아보세요! 좌우로 밀어서 취향을 알려주세요.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category] || { name: '제품', description: '스와이프로 제품을 탐색하세요!' };

  return {
    title: `${info.name} 발견하기 | 계급도`,
    description: info.description,
  };
}

export default async function DiscoverPage({ params }: Props) {
  const { category } = await params;

  return <DiscoverContent category={category} />;
}
