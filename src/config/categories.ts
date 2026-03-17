/**
 * 중앙 집중식 카테고리 설정
 *
 * 이 파일은 API 우선 구조를 위한 폴백 설정을 제공합니다.
 * 실제 데이터는 백엔드 API의 Category 모델에서 가져옵니다.
 *
 * 사용 우선순위:
 * 1. useCategory() 훅으로 API에서 가져온 데이터
 * 2. 이 파일의 CATEGORY_FALLBACKS (API 실패 시 폴백)
 *
 * @see docs/TIER_CHART_GUIDE.md 계급도 데이터 가이드라인
 */

import { TierLevel } from '@/lib/tier';
import type { Category, CategoryDisplayConfig, CategoryGroup } from '@/types/model';

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
 * API Category에서 CategoryConfig로 변환
 */
export function categoryToConfig(category: Category): CategoryConfig {
  const displayConfig = category.display_config || {};

  return {
    slug: category.slug,
    name: category.name,
    icon: category.icon || '📦',
    color: displayConfig.color || '#3B82F6',
    tierChart: {
      brandTiers: DEFAULT_BRAND_TIERS,
      usageTiers: DEFAULT_BRAND_TIERS,
      brandLinkType: 'brand',
      brandLabel: displayConfig.itemLabel || '브랜드',
      productLabel: displayConfig.itemLabel || '제품',
    },
  };
}

/**
 * API Category 또는 폴백에서 간단한 정보 추출
 */
export function getCategoryInfo(categoryOrSlug: Category | string): {
  name: string;
  icon: string;
  color: string;
  itemLabel: string;
} {
  // API Category 객체가 전달된 경우
  if (typeof categoryOrSlug !== 'string') {
    const config = categoryOrSlug.display_config || {};
    return {
      name: categoryOrSlug.name,
      icon: categoryOrSlug.icon || '📦',
      color: config.color || '#3B82F6',
      itemLabel: config.itemLabel || categoryOrSlug.name,
    };
  }

  // slug가 전달된 경우 폴백 사용
  const fallback = CATEGORY_MAP[categoryOrSlug];
  if (fallback) {
    return {
      name: fallback.name,
      icon: fallback.icon,
      color: fallback.color,
      itemLabel: fallback.tierChart.productLabel,
    };
  }

  // 기본값
  return {
    name: '제품',
    icon: '📦',
    color: '#3B82F6',
    itemLabel: '제품',
  };
}

/**
 * 카테고리 그룹 라벨
 */
export const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  sports: '스포츠',
  food: '음식',
  tech: '테크',
  lifestyle: '라이프',
  '': '기타',
};

/**
 * 카테고리 그룹 설정 인터페이스
 */
export interface CategoryGroupConfig {
  /** 그룹 키 (백엔드 CategoryGroup과 일치) */
  key: CategoryGroup;
  /** 표시 라벨 */
  label: string;
  /** 그룹 아이콘 (이모지) */
  icon: string;
  /** 소속 카테고리 slug 목록 (순서 = 표시 순서) */
  categories: string[];
}

/**
 * 카테고리 그룹 설정
 *
 * 새 카테고리 추가 시:
 * 1. CATEGORY_CONFIGS에 카테고리 설정 추가
 * 2. 해당 그룹의 categories 배열에 slug 추가
 */
export const CATEGORY_GROUPS: CategoryGroupConfig[] = [
  {
    key: 'sports',
    label: CATEGORY_GROUP_LABELS['sports'],
    icon: '🏃',
    categories: ['running-shoes'],
  },
  {
    key: 'food',
    label: CATEGORY_GROUP_LABELS['food'],
    icon: '🍽',
    categories: ['chicken'],
  },
  {
    key: 'tech',
    label: CATEGORY_GROUP_LABELS['tech'],
    icon: '⌚',
    categories: ['mens-watch'],
  },
  {
    key: 'lifestyle',
    label: CATEGORY_GROUP_LABELS['lifestyle'],
    icon: '✨',
    categories: [],
  },
];

/**
 * 그룹 키로 그룹 설정 조회
 */
export function getCategoryGroup(groupKey: CategoryGroup): CategoryGroupConfig | undefined {
  return CATEGORY_GROUPS.find((g) => g.key === groupKey);
}

/**
 * 카테고리 slug로 소속 그룹 조회
 */
export function getGroupBySlug(slug: string): CategoryGroupConfig | undefined {
  return CATEGORY_GROUPS.find((g) => g.categories.includes(slug));
}

/**
 * API Category 배열을 그룹별로 분류
 * 그룹이 없는 카테고리는 '기타'로 분류
 */
export function groupCategories<T extends { slug: string; group?: CategoryGroup | string }>(
  categories: T[]
): { group: CategoryGroupConfig; items: T[] }[] {
  const result: { group: CategoryGroupConfig; items: T[] }[] = [];

  for (const group of CATEGORY_GROUPS) {
    const items = categories.filter((c) => {
      // API group 필드 우선, 없으면 config의 categories 배열로 확인
      if (c.group && c.group === group.key) return true;
      return group.categories.includes(c.slug);
    });
    if (items.length > 0) {
      result.push({ group, items });
    }
  }

  // 어떤 그룹에도 속하지 않는 카테고리
  const groupedSlugs = new Set(result.flatMap((r) => r.items.map((i) => i.slug)));
  const ungrouped = categories.filter((c) => !groupedSlugs.has(c.slug));
  if (ungrouped.length > 0) {
    result.push({
      group: { key: '' as CategoryGroup, label: '기타', icon: '📦', categories: [] },
      items: ungrouped,
    });
  }

  return result;
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
      brandTiers: EXTENDED_TIERS, // 모든 티어 표시 (S~D)
      usageTiers: EXTENDED_TIERS,
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
      brandTiers: EXTENDED_TIERS, // 모든 티어 표시 (S~D)
      usageTiers: EXTENDED_TIERS,
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
      brandTiers: EXTENDED_TIERS, // 모든 티어 표시 (S~D)
      usageTiers: EXTENDED_TIERS,
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
