const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tier-chart.com';
const SITE_NAME = '티어차트 계급도';

/**
 * WebSite schema - 사이트 전체에 적용
 */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '러닝화, 치킨, 커피 등 다양한 카테고리의 계급도를 한눈에 비교하고 나만의 계급도를 만들어보세요.',
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/running-shoes/discover?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * ItemList schema - 목록 페이지 (계급도 목록 등)
 */
export function generateItemListJsonLd(items: Array<{ name: string; url: string; position: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Article schema - 사용자 계급도 상세 페이지
 */
export function generateArticleJsonLd(chart: {
  title: string;
  description: string;
  slug: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: chart.title,
    description: chart.description,
    url: `${SITE_URL}/open/${chart.slug}`,
    author: {
      '@type': 'Person',
      name: chart.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: chart.createdAt || new Date().toISOString(),
    dateModified: chart.updatedAt || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/open/${chart.slug}`,
    },
  };
}

/**
 * BreadcrumbList schema - 페이지 계층 구조
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
