import { Metadata } from 'next';
import { TierChartDetailContent } from './TierChartDetailContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `계급도 | 계급도`,
    description: '사용자가 만든 계급도를 확인해보세요!',
    openGraph: {
      title: '계급도',
      description: '사용자가 만든 계급도를 확인해보세요!',
      images: [`/api/og?type=user-tier&slug=${slug}`],
    },
  };
}

export default async function TierChartDetailPage({ params }: Props) {
  const { slug } = await params;

  return <TierChartDetailContent slug={slug} />;
}
