import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: {
    default: '계급도 - 러닝화 계급도 큐레이션',
    template: '%s | 계급도',
  },
  description: '나와 발형이 비슷한 러너들이 선택한 러닝화를 찾아보세요. 브랜드 계급도, 3분 진단, 모델 비교까지.',
  keywords: ['러닝화', '계급도', '러닝화 추천', '러닝화 비교', '러닝화 리뷰'],
  authors: [{ name: '계급도' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://gyegeupdo.kr',
    siteName: '계급도',
    title: '계급도 - 러닝화 계급도 큐레이션',
    description: '나와 발형이 비슷한 러너들이 선택한 러닝화를 찾아보세요.',
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
    title: '계급도 - 러닝화 계급도 큐레이션',
    description: '나와 발형이 비슷한 러너들이 선택한 러닝화를 찾아보세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
