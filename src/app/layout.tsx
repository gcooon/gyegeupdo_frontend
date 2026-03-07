import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { generateWebSiteJsonLd } from '@/lib/jsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tier-chart.com'),
  title: {
    default: '계급도 - 모든 계급도를 한눈에',
    template: '%s | 계급도',
  },
  description: '러닝화, 치킨, 커피 등 다양한 카테고리의 계급도를 한눈에 비교하고 나만의 계급도를 만들어보세요.',
  keywords: ['계급도', '티어 리스트', '순위 비교', '러닝화 계급도', '치킨 계급도', '커피 계급도'],
  authors: [{ name: '계급도' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://tier-chart.com',
    siteName: '계급도',
    title: '계급도 - 모든 계급도를 한눈에',
    description: '러닝화, 치킨, 커피 등 다양한 카테고리의 계급도를 한눈에 비교하고 나만의 계급도를 만들어보세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '계급도',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '계급도 - 모든 계급도를 한눈에',
    description: '러닝화, 치킨, 커피 등 다양한 카테고리의 계급도를 한눈에 비교하고 나만의 계급도를 만들어보세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      'naver-site-verification': ['f5eaa5925436b936790bd222a2493fd0e604c0dd'],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteJsonLd()),
          }}
        />
      </head>
      <body className="font-pretendard antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
