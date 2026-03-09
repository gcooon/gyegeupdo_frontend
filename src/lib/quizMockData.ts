/**
 * 퀴즈 기능을 위한 Mock 데이터
 *
 * 참고: 향후 백엔드 API가 퀴즈 추천 기능을 지원하면
 * 이 파일의 데이터는 API 호출로 대체될 예정입니다.
 */

import type { TierLevel } from '@/lib/tier';

// 치킨 메뉴 타입 (퀴즈 추천용 간소화 버전)
interface ChickenMenu {
  slug: string;
  tier: TierLevel;
  tier_score: number;
}

// 치킨 추천 항목 타입
interface ChickenRecommendation {
  slug: string;
  name: string;
  brand: string;
  match: number;
  reason: string;
}

// 치킨 메뉴 Mock 데이터 (퀴즈 추천에 필요한 필드만)
export const CHICKEN_MENUS: ChickenMenu[] = [
  // S티어
  { slug: 'bbq-golden-olive', tier: 'S', tier_score: 94.5 },
  { slug: 'kyochon-original', tier: 'S', tier_score: 93.0 },
  { slug: 'bhc-puringkle', tier: 'S', tier_score: 92.5 },
  // A티어
  { slug: 'kyochon-red', tier: 'A', tier_score: 88.5 },
  { slug: 'goobne-gochu', tier: 'A', tier_score: 87.0 },
  { slug: 'nene-snowing', tier: 'A', tier_score: 86.5 },
  { slug: 'puradak-black-allio', tier: 'A', tier_score: 86.0 },
  { slug: 'bbq-jamaica', tier: 'A', tier_score: 85.5 },
  { slug: 'bhc-matchoking', tier: 'A', tier_score: 85.0 },
  // B티어
  { slug: 'goobne-volcano', tier: 'B', tier_score: 82.0 },
  { slug: 'cheogajip-supreme', tier: 'B', tier_score: 80.5 },
  { slug: 'pelicana-yangnyum', tier: 'B', tier_score: 79.5 },
  { slug: 'hosigi-fried', tier: 'B', tier_score: 78.0 },
  { slug: 'mexicana-half', tier: 'B', tier_score: 77.0 },
  // C티어
  { slug: '60gye-fried', tier: 'C', tier_score: 68.0 },
  { slug: 'zicoba-charcoal', tier: 'C', tier_score: 66.0 },
  { slug: 'norang-fried', tier: 'C', tier_score: 65.0 },
  { slug: 'bigchicken-fried', tier: 'C', tier_score: 64.0 },
  { slug: 'gamachi-fried', tier: 'C', tier_score: 62.0 },
  { slug: 'jadam-boneless', tier: 'C', tier_score: 60.0 },
  { slug: 'ttoraeore-fried', tier: 'C', tier_score: 58.0 },
  { slug: 'ddangddang-fried', tier: 'C', tier_score: 56.0 },
  { slug: 'pizzanara-fried', tier: 'C', tier_score: 55.0 },
  // D티어
  { slug: 'mart-chicken', tier: 'D', tier_score: 38.0 },
  { slug: 'convenience-chicken', tier: 'D', tier_score: 35.0 },
  { slug: 'frozen-chicken', tier: 'D', tier_score: 32.0 },
  { slug: 'school-chicken', tier: 'D', tier_score: 25.0 },
];

// 치킨 퀴즈 추천 결과
export const CHICKEN_RECOMMENDATIONS: Record<string, ChickenRecommendation[]> = {
  // 후라이드 + 혼닭 + 맥주
  'original_alone_beer': [
    { slug: 'bbq-golden-olive', name: '황금올리브치킨', brand: 'BBQ', match: 95, reason: '혼자 즐기기 좋은 바삭한 프리미엄 후라이드' },
    { slug: 'kyochon-original', name: '교촌 오리지날', brand: '교촌', match: 90, reason: '담백한 간장 풍미의 클래식' },
    { slug: 'hosigi-fried', name: '호식이 후라이드', brand: '호식이', match: 85, reason: '가성비 좋은 든든한 선택' },
  ],
  // 양념 + 파티 + 맥주
  'sweet_party_beer': [
    { slug: 'bhc-puringkle', name: '뿌링클', brand: 'BHC', match: 96, reason: '모임에서 인기 폭발, 치즈 시즈닝의 매력' },
    { slug: 'kyochon-red', name: '교촌 레드', brand: '교촌', match: 88, reason: '달콤매콤, 누구나 좋아하는 맛' },
    { slug: 'nene-snowing', name: '네네 스노윙', brand: '네네', match: 85, reason: '눈꽃 치즈로 파티 분위기 UP' },
  ],
  // 매운맛 + 소주
  'spicy_couple_soju': [
    { slug: 'goobne-gochu', name: '굽네 고추바사삭', brand: '굽네', match: 94, reason: '칼칼한 매운맛에 소주가 술술' },
    { slug: 'bhc-matchoking', name: '맛초킹', brand: 'BHC', match: 89, reason: '매콤달콤 중독성 있는 맛' },
    { slug: 'cheogajip-supreme', name: '처갓집 슈프림양념', brand: '처갓집', match: 82, reason: '진한 양념의 매력' },
  ],
  // 마늘/간장 + 식사대용
  'garlic_meal_none': [
    { slug: 'puradak-black-allio', name: '푸라닭 블랙알리오', brand: '푸라닭', match: 97, reason: '마늘 풍미 가득, 든든한 한 끼' },
    { slug: 'kyochon-original', name: '교촌 오리지날', brand: '교촌', match: 91, reason: '간장 베이스의 깊은 맛' },
    { slug: 'bbq-jamaica', name: 'BBQ 자메이카 통다리', brand: 'BBQ', match: 86, reason: '풍부한 향신료의 이국적 맛' },
  ],
  // 기본 추천 (fallback)
  'default': [
    { slug: 'bbq-golden-olive', name: '황금올리브치킨', brand: 'BBQ', match: 92, reason: '대한민국 대표 치킨, 모두가 인정하는 맛' },
    { slug: 'bhc-puringkle', name: '뿌링클', brand: 'BHC', match: 88, reason: 'MZ세대 인기 1위, 중독성 있는 치즈맛' },
    { slug: 'kyochon-original', name: '교촌 오리지날', brand: '교촌', match: 85, reason: '간장치킨의 원조, 변함없는 클래식' },
  ],
};
