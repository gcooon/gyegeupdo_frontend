import { Metadata } from 'next';
import { TierChartDetailContent } from './TierChartDetailContent';
import { getMockUserTierChart } from '@/lib/mockUserTierCharts';
import { generateSeoMeta } from '@/lib/seo';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/jsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chart = getMockUserTierChart(slug);

  if (chart) {
    return generateSeoMeta({
      title: `${chart.title} - 사용자 계급도`,
      description: chart.description || `${chart.title} - S~D 등급으로 나눈 사용자 계급도. 조회수 ${chart.view_count}회, 좋아요 ${chart.like_count}개.`,
      path: `/open/${slug}`,
      image: `/api/og?type=my-tier&title=${encodeURIComponent(chart.title)}`,
    });
  }

  return generateSeoMeta({
    title: '사용자 계급도',
    description: '사용자가 만든 계급도를 확인해보세요!',
    path: `/open/${slug}`,
    image: `/api/og?type=user-tier&slug=${slug}`,
  });
}

export default async function TierChartDetailPage({ params }: Props) {
  const { slug } = await params;
  const chart = getMockUserTierChart(slug);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '내가 만든 계급도', path: '/open' },
    { name: chart?.title || '계급도', path: `/open/${slug}` },
  ]);

  const articleJsonLd = chart
    ? generateArticleJsonLd({
        title: chart.title,
        description: chart.description || '',
        slug,
        author: chart.user_nickname,
        createdAt: chart.created_at,
        updatedAt: chart.updated_at,
      })
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <TierChartDetailContent slug={slug} initialChart={chart || undefined} />
    </>
  );
}
