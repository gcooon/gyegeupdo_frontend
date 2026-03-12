/**
 * 중앙집중식 카테고리 설정 모듈
 *
 * 이 모듈은 백엔드 API에서 가져온 카테고리 데이터를 기반으로
 * 프론트엔드 전역에서 일관된 카테고리 정보를 제공합니다.
 *
 * 사용 방법:
 * 1. Server Component: await fetchCategories() 또는 await fetchCategory(slug)
 * 2. Client Component: useCategories() 또는 useCategory(slug) 훅 사용
 * 3. 정적 페이지: generateStaticParams()에서 getCategorySlugs() 사용
 */

import { Category, CategoryDisplayConfig } from '@/types/model';

// 카테고리 목록 응답 타입
interface CategoryListResponse {
  results: Category[];
  count: number;
}

// API URL (서버 사이드에서 사용)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// 기본 display_config (백엔드에서 설정이 없을 경우 폴백)
const DEFAULT_DISPLAY_CONFIG = {
  color: '#3B82F6',
  heroTitle: '계급도',
  heroDescription: '제품의 티어를 확인하세요',
  itemLabel: '제품',
  quizCTA: '나에게 맞는 제품 찾기',
};

// 기본 아이콘 (백엔드에서 설정이 없을 경우)
const DEFAULT_ICON = '📦';

/**
 * 서버 사이드에서 모든 카테고리 목록 가져오기
 * native fetch 사용으로 서버 컴포넌트에서도 안전하게 사용 가능
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories/`, {
      next: { revalidate: 300 }, // 5분 캐시
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data: ApiResponse<CategoryListResponse> = await response.json();
    return data.data.results;
  } catch {
    return [];
  }
}

/**
 * 서버 사이드에서 단일 카테고리 상세 정보 가져오기
 * native fetch 사용으로 서버 컴포넌트에서도 안전하게 사용 가능
 */
export async function fetchCategory(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/categories/${slug}/`, {
      next: { revalidate: 300 }, // 5분 캐시
    });
    if (!response.ok) throw new Error(`Failed to fetch category ${slug}`);
    const data: ApiResponse<Category> = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

/**
 * 정적 생성용 카테고리 slug 목록 가져오기
 * generateStaticParams()에서 사용
 */
export async function getCategorySlugs(): Promise<string[]> {
  const categories = await fetchCategories();
  return categories.map((cat) => cat.slug);
}

/**
 * 카테고리 표시 정보 추출 헬퍼
 * 컴포넌트에서 category 객체로부터 필요한 정보 추출 시 사용
 */
export function getCategoryDisplayInfo(category: Category | null) {
  if (!category) {
    return {
      name: '제품',
      icon: DEFAULT_ICON,
      slug: '',
      color: DEFAULT_DISPLAY_CONFIG.color,
      heroTitle: DEFAULT_DISPLAY_CONFIG.heroTitle,
      heroDescription: DEFAULT_DISPLAY_CONFIG.heroDescription,
      itemLabel: DEFAULT_DISPLAY_CONFIG.itemLabel,
      quizCTA: DEFAULT_DISPLAY_CONFIG.quizCTA,
    };
  }

  const config = category.display_config || {};

  return {
    name: category.name,
    icon: category.icon || DEFAULT_ICON,
    slug: category.slug,
    color: config.color || DEFAULT_DISPLAY_CONFIG.color,
    heroTitle: config.heroTitle || `${category.name} 계급도`,
    heroDescription: config.heroDescription || `${category.name}의 티어를 확인하세요`,
    itemLabel: config.itemLabel || category.name,
    quizCTA: config.quizCTA || `나에게 맞는 ${category.name} 찾기`,
  };
}

/**
 * usage 옵션을 탭 형식으로 변환
 * 용도별 계급도 탭에서 사용
 */
export function getUsageTabs(category: Category | null) {
  if (!category?.filter_definitions?.usage) {
    return [];
  }

  return category.filter_definitions.usage.map((usage) => ({
    key: usage.value,
    label: usage.label,
    description: usage.description || '',
    icon: usage.icon || '',
  }));
}

/**
 * product_type 옵션을 필터 형식으로 변환
 */
export function getProductTypeFilters(category: Category | null) {
  if (!category?.filter_definitions?.product_type) {
    return [];
  }

  return category.filter_definitions.product_type.map((type) => ({
    value: type.value,
    label: type.label,
    description: type.description || '',
  }));
}

/**
 * spec 정의에서 라벨 가져오기
 */
export function getSpecLabel(category: Category | null, key: string): string {
  if (!category?.spec_definitions) return key;

  const spec = category.spec_definitions.find((s) => s.key === key);
  return spec?.label || key;
}

/**
 * score 정의에서 라벨 가져오기
 */
export function getScoreLabel(category: Category | null, key: string): string {
  if (!category?.score_definitions) return key;

  const score = category.score_definitions.find((s) => s.key === key);
  return score?.label || key;
}
