import { MetadataRoute } from 'next';
import { fetchCategories } from '@/lib/category-config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tier-chart.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface Post {
  id: number;
  category?: { slug: string };
}

interface TierChart {
  slug: string;
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts/?page_size=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.results || [];
  } catch {
    return [];
  }
}

async function fetchTierCharts(): Promise<TierChart[]> {
  try {
    const res = await fetch(`${API_URL}/tiers/user-charts/?page_size=50`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.results || [];
  } catch {
    return [];
  }
}

// 카테고리별 서브 페이지 정의
const CATEGORY_SUB_PAGES = [
  { path: '', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/tier', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/quiz', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/discover', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/compare', changeFrequency: 'weekly' as const, priority: 0.6 },
  { path: '/board', changeFrequency: 'daily' as const, priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // API에서 동적 데이터 fetch (병렬)
  const [categories, posts, tierCharts] = await Promise.all([
    fetchCategories(),
    fetchPosts(),
    fetchTierCharts(),
  ]);

  // 1. 정적 페이지 (카테고리 무관)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/official`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/open`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // 2. 카테고리 페이지 (API 기반 동적 생성)
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((category) =>
    CATEGORY_SUB_PAGES.map((subPage) => ({
      url: `${SITE_URL}/${category.slug}${subPage.path}`,
      lastModified: now,
      changeFrequency: subPage.changeFrequency,
      priority: subPage.priority,
    }))
  );

  // 3. 게시글 상세 페이지 (API 기반)
  const postPages: MetadataRoute.Sitemap = posts
    .filter((post) => post.category?.slug)
    .map((post) => ({
      url: `${SITE_URL}/${post.category!.slug}/board/${post.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

  // 4. 사용자 계급도 (API 기반)
  const tierChartPages: MetadataRoute.Sitemap = tierCharts.map((chart) => ({
    url: `${SITE_URL}/open/${chart.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...postPages, ...tierChartPages];
}
