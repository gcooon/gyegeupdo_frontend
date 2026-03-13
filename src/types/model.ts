import { TierLevel } from '@/lib/tier';

// 카테고리 표시 설정
export interface CategoryDisplayConfig {
  color?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroSubDescription?: string;  // 서브 설명 (예: "커뮤니티 리뷰를 바탕으로 티어로 분류된...")
  itemLabel?: string;
  quizCTA?: string;
  stats?: {
    modelCount?: string;
    reviewCount?: string;
    brandCount?: string;
  };
}

// 카테고리 그룹 타입
export type CategoryGroup = 'sports' | 'food' | 'tech' | 'lifestyle' | '';

// 카테고리 그룹 라벨
export const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  sports: '스포츠',
  food: '음식',
  tech: '테크',
  lifestyle: '라이프',
  '': '기타',
};

// 카테고리 (동적 정의 포함)
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  group: CategoryGroup;
  description: string;
  spec_definitions: SpecDefinition[];
  score_definitions: ScoreDefinition[];
  brand_score_definitions: ScoreDefinition[];
  quiz_definitions: QuizDefinition[];
  filter_definitions: FilterDefinitions;
  display_config: CategoryDisplayConfig;
  display_order: number;
  is_active: boolean;
  product_count?: number;
  brand_count?: number;
}

// 카테고리 목록용 (간략)
export interface CategoryListItem {
  id: number;
  name: string;
  slug: string;
  icon: string;
  group: CategoryGroup;
  description: string;
  display_config: CategoryDisplayConfig;
  display_order: number;
  product_count?: number;
  brand_count?: number;
}

// 카테고리 목록 응답
export interface CategoryListResponse {
  results: CategoryListItem[];
  count: number;
}

export interface SpecDefinition {
  key: string;
  label: string;
  unit?: string;
  type?: 'number' | 'text' | 'select' | 'boolean';
  options?: { value: string; label: string }[];
}

export interface ScoreDefinition {
  key: string;
  label: string;
  weight: number;
}

export interface QuizDefinition {
  key: string;
  question: string;
  emoji?: string;
  options: { value: string; label: string; description?: string }[];
}

export interface FilterOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface FilterDefinitions {
  product_type?: FilterOption[];
  usage?: FilterOption[];
}

// 브랜드
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  tier: TierLevel;
  tier_score: number;
  lineup_score?: number;
  tech_score?: number;
  durability_score?: number;
  community_score?: number;
  category_slug?: string;
  category?: string;
  description?: string;
  product_count?: number;
  brand_name?: string; // 치킨 메뉴의 브랜드명 (예: BBQ, 교촌)
  scores?: { key: string; label: string; value: number }[];
}

// 제품 (일반화된 구조)
export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: Brand;
  category_slug: string;
  image_url: string;
  tier: TierLevel;
  tier_score: number;
  community_tier?: TierLevel;
  product_type: string;
  usage: string;
  price_min: number;
  price_max: number;
  review_count: number;
  view_count: number;
  like_count: number;
  trend?: 'up' | 'down' | 'stable';
  specs: Record<string, string>;
  scores: Record<string, number>;
}

export interface ProductSpec {
  key: string;
  value: string;
  label: string;
  unit?: string;
}

export interface ProductScore {
  key: string;
  value: number;
  label: string;
  weight: number;
}

export interface ProductTrap {
  id: number;
  trap_type: string;
  trap_description: string;
}

export interface ProductDetail extends Omit<Product, 'specs' | 'scores'> {
  description: string;
  coupang_link?: string;
  naver_link?: string;
  release_year?: number;
  version_number?: number;
  category: Category;
  specs: ProductSpec[];
  scores: ProductScore[];
  traps: ProductTrap[];
  alternatives: Product[];
  prev_version?: {
    id: number;
    name: string;
    slug: string;
    tier: TierLevel;
    tier_score: number;
  };
  filter_labels: {
    product_type: string;
    usage: string;
  };
  seo_meta?: {
    title: string;
    description: string;
  };
  is_liked?: boolean;
}

export interface ProductListResponse {
  count: number;
  results: Product[];
  next?: string;
  previous?: string;
}

export interface ProductFilters {
  category?: string;
  tier?: TierLevel[];
  product_type?: string;
  usage?: string;
  price_max?: number;
  brand?: string;
  page?: number;
}

// 하위 호환성을 위한 별칭
export type ShoeModel = Product;
export type ModelSpec = ProductSpec;
export type ModelTrap = ProductTrap;
export type ModelDetail = ProductDetail;
export type ModelListResponse = ProductListResponse;
export type ModelFilters = ProductFilters;
