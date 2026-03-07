import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyegeupdo.kr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/running-shoes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/running-shoes/tier`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/running-shoes/quiz`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/running-shoes/discover`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/running-shoes/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/running-shoes/board`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/my-tier`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // 치킨 카테고리
    {
      url: `${SITE_URL}/chicken`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/chicken/tier`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/chicken/quiz`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/chicken/discover`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/chicken/board`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  // 게시글 상세 페이지
  const boardPostIds: Record<string, string[]> = {
    'running-shoes': ['1', '2', '3', '4', '5', '6', '7'],
    'chicken': ['101', '102', '103', '104', '105', '106'],
  };

  const boardPostPages: MetadataRoute.Sitemap = Object.entries(boardPostIds).flatMap(
    ([category, ids]) =>
      ids.map((id) => ({
        url: `${SITE_URL}/${category}/board/${id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
  );

  // 내가 만든 계급도 샘플 페이지
  const tierChartSlugs = [
    'ramen-tier',
    'coffee-franchise-tier',
    'delivery-app-tier',
    'convenience-store-dosirak-tier',
  ];

  const tierChartPages: MetadataRoute.Sitemap = tierChartSlugs.map((slug) => ({
    url: `${SITE_URL}/my-tier/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...boardPostPages, ...tierChartPages];
}
