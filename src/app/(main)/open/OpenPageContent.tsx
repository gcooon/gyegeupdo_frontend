'use client';

import { useSearchParams } from 'next/navigation';
import { OpenHeroSection, CreateGuideSection, HallOfFameSection } from '@/components/open';
import { HotOpenTierCharts } from '@/components/home/HotOpenTierCharts';
import { MyTierListContent } from './MyTierListContent';

export function OpenPageContent() {
  const searchParams = useSearchParams();
  const hasSort = searchParams.get('sort');
  const hasTab = searchParams.get('tab');

  // URL 파라미터가 있으면 해당 필터된 목록만 표시
  // URL 파라미터가 없으면 (홈) 전체 섹션 표시
  const isFilteredView = hasSort || hasTab;

  if (isFilteredView) {
    // 필터된 뷰: 목록만 표시
    return <MyTierListContent />;
  }

  // 홈 뷰: 전체 섹션 표시
  return (
    <div className="space-y-8">
      {/* 히어로 섹션 */}
      <div className="container max-w-6xl">
        <OpenHeroSection />
      </div>

      {/* HOT 오픈 계급도 */}
      <div className="container max-w-6xl">
        <HotOpenTierCharts />
      </div>

      {/* 명예의전당 섹션 */}
      <div className="container max-w-6xl">
        <HallOfFameSection />
      </div>

      {/* 계급도 만들기 가이드 */}
      <div className="container max-w-6xl">
        <CreateGuideSection />
      </div>

      {/* 전체 목록 */}
      <MyTierListContent />
    </div>
  );
}
