import { Suspense } from 'react';
import { Metadata } from 'next';
import { MypageContent } from './MypageContent';
import { generateSeoMeta } from '@/lib/seo';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...generateSeoMeta({
    title: '마이페이지 - 내 프로필',
    description: '나의 활동 내역, 뱃지, 레벨을 확인하세요.',
    path: '/mypage',
  }),
};

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function MypagePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <MypageContent />
      </Suspense>
    </div>
  );
}
