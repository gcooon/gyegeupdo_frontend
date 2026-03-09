/**
 * 중앙 집중식 카테고리 설정
 *
 * 모든 카테고리 관련 설정은 이 파일에서 관리합니다.
 * 새 카테고리 추가 시 이 파일만 수정하면 됩니다.
 *
 * @see docs/TIER_CHART_GUIDE.md 계급도 데이터 가이드라인
 */

import { TierLevel } from '@/lib/tier';

/**
 * 카테고리 설정 인터페이스
 */
export interface CategoryConfig {
  /** 카테고리 슬러그 (URL에 사용) */
  slug: string;
  /** 카테고리 이름 */
  name: string;
  /** 카테고리 아이콘 (이모지) */
  icon: string;
  /** 테마 색상 */
  color: string;

  /**
   * 계급도 설정
   */
  tierChart: {
    /** 브랜드 계급도에서 표시할 티어 범위 (기본: S~B) */
    brandTiers: TierLevel[];
    /** 용도별 계급도에서 표시할 티어 범위 (기본: S~B) */
    usageTiers: TierLevel[];
    /** 브랜드 클릭 시 이동할 페이지 타입 */
    brandLinkType: 'brand' | 'product';
    /** 브랜드 라벨 (예: "브랜드", "프랜차이즈", "메이커") */
    brandLabel: string;
    /** 제품 라벨 (예: "제품", "모델", "메뉴") */
    productLabel: string;
  };

  /**
   * 티어 라벨 (기본값 사용 시 생략 가능)
   * 기본값: { S: '황제', A: '왕', B: '양반', C: '중인', D: '평민' }
   */
  tierLabels?: Partial<Record<TierLevel, string>>;
}

/**
 * 기본 티어 라벨
 */
export const DEFAULT_TIER_LABELS: Record<TierLevel, string> = {
  S: '황제',
  A: '왕',
  B: '양반',
  C: '중인',
  D: '평민',
};

/**
 * 기본 티어 범위 (S~B)
 */
export const DEFAULT_BRAND_TIERS: TierLevel[] = ['S', 'A', 'B'];
export const DEFAULT_USAGE_TIERS: TierLevel[] = ['S', 'A', 'B'];

/**
 * 확장 티어 범위 (S~D, 평민까지)
 */
export const EXTENDED_TIERS: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

/**
 * 카테고리 설정 목록
 *
 * 새 카테고리 추가 시 여기에 설정을 추가하세요.
 */
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    color: '#E94560',
    tierChart: {
      brandTiers: DEFAULT_BRAND_TIERS,
      usageTiers: DEFAULT_BRAND_TIERS,
      brandLinkType: 'brand',
      brandLabel: '브랜드',
      productLabel: '모델',
    },
  },
  {
    slug: 'chicken',
    name: '치킨',
    icon: '🍗',
    color: '#FF6B00',
    tierChart: {
      brandTiers: DEFAULT_BRAND_TIERS,
      usageTiers: DEFAULT_BRAND_TIERS,
      brandLinkType: 'brand', // 프랜차이즈 페이지로 이동
      brandLabel: '프랜차이즈',
      productLabel: '메뉴',
    },
  },
  {
    slug: 'mens-watch',
    name: '남자시계',
    icon: '⌚',
    color: '#1E3A5F',
    tierChart: {
      brandTiers: EXTENDED_TIERS, // 시계는 평민까지 표시
      usageTiers: DEFAULT_BRAND_TIERS,
      brandLinkType: 'brand',
      brandLabel: '브랜드',
      productLabel: '모델',
    },
  },
];

/**
 * 카테고리 슬러그로 설정 조회
 */
export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIGS.find((c) => c.slug === slug);
}

/**
 * 카테고리 슬러그 맵 (빠른 조회용)
 */
export const CATEGORY_MAP: Record<string, CategoryConfig> = CATEGORY_CONFIGS.reduce(
  (acc, config) => {
    acc[config.slug] = config;
    return acc;
  },
  {} as Record<string, CategoryConfig>
);

/**
 * 카테고리 슬러그 목록
 */
export const CATEGORY_SLUGS = CATEGORY_CONFIGS.map((c) => c.slug);

/**
 * 헤더/네비게이션용 카테고리 목록
 */
export const NAV_CATEGORIES = CATEGORY_CONFIGS.map((c) => ({
  slug: c.slug,
  name: c.name,
  icon: c.icon,
}));

/**
 * 카테고리별 티어 라벨 조회
 */
export function getTierLabel(category: string, tier: TierLevel): string {
  const config = getCategoryConfig(category);
  return config?.tierLabels?.[tier] ?? DEFAULT_TIER_LABELS[tier];
}

/**
 * 브랜드 클릭 시 이동할 URL 생성
 */
export function getBrandHref(category: string, brandSlug: string): string {
  const config = getCategoryConfig(category);
  const linkType = config?.tierChart.brandLinkType ?? 'brand';

  if (linkType === 'product') {
    return `/${category}/model/${brandSlug}`;
  }
  return `/${category}/brand/${brandSlug}`;
}

/**
 * 제품 클릭 시 이동할 URL 생성
 */
export function getProductHref(category: string, productSlug: string): string {
  return `/${category}/model/${productSlug}`;
}
