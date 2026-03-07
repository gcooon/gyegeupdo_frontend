import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyegeupdo.kr';
const SITE_NAME = '계급도';

interface SeoParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateSeoMeta({
  title,
  description,
  path = '',
  image = '/og-image.png',
  noIndex = false,
}: SeoParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generateModelSeo(model: {
  name: string;
  brand: { name: string };
  tier: string;
  usage: string;
  review_count: number;
  drop?: number;
  stack?: number;
  width?: string;
  slug: string;
}): Metadata {
  const title = `${model.brand.name} ${model.name} 계급도 — ${model.tier}티어 2026`;
  const description = `${model.name} ${model.review_count}개 후기 종합. 드롭 ${model.drop || '-'}mm / 스택 ${model.stack || '-'}mm / 발볼 ${model.width || '보통'}. ${model.usage} 러너 추천.`;

  return generateSeoMeta({
    title,
    description,
    path: `/model/${model.slug}`,
    image: `/api/og?model=${model.slug}`,
  });
}
