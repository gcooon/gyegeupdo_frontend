'use client';

import { OpenHeroSection, FeaturedCharts, CreateGuideSection } from '@/components/open';
import { HotOpenTierCharts } from '@/components/home/HotOpenTierCharts';
import { MyTierListContent } from './MyTierListContent';

export function OpenPageContent() {
  return (
    <div className="space-y-8">
      {/* 히어로 섹션 */}
      <div className="container max-w-6xl">
        <OpenHeroSection />
      </div>

      {/* 피처드 계급도 */}
      <div className="container max-w-6xl">
        <FeaturedCharts />
      </div>

      {/* HOT 오픈 계급도 */}
      <div className="container max-w-6xl">
        <HotOpenTierCharts />
      </div>

      {/* 계급도 만들기 가이드 */}
      <div className="container max-w-6xl">
        <CreateGuideSection />
      </div>

      {/* 기존 탭 + 목록 */}
      <MyTierListContent />
    </div>
  );
}
