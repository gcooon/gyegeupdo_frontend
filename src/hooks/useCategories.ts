'use client';

import { useQuery } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { Category, CategoryListItem, CategoryListResponse } from '@/types/model';

/**
 * 활성화된 모든 카테고리 목록 조회
 * - 홈페이지 카테고리 목록
 * - 네비게이션 메뉴
 * - 동적 라우팅에 필요한 slug 목록
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CategoryListResponse>>('/categories/');
      return response.data.data.results;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 (카테고리는 자주 변경되지 않음)
  });
}

/**
 * 단일 카테고리 상세 정보 조회 (slug 기준)
 * - 카테고리 랜딩 페이지
 * - 제품 목록 페이지
 * - 퀴즈 페이지 등
 *
 * 모든 정의 포함: filter_definitions, spec_definitions, score_definitions, quiz_definitions
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category>>(`/categories/${slug}/`);
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 카테고리별 usage 옵션 조회 (filter_definitions에서 추출)
 * - 용도별 계급도 탭 생성에 사용
 */
export function useCategoryUsages(slug: string) {
  const { data: category, ...rest } = useCategory(slug);

  const usages = category?.filter_definitions?.usage || [];

  return {
    ...rest,
    data: usages,
  };
}

/**
 * 카테고리별 product_type 옵션 조회
 * - 제품 타입 필터에 사용
 */
export function useCategoryProductTypes(slug: string) {
  const { data: category, ...rest } = useCategory(slug);

  const productTypes = category?.filter_definitions?.product_type || [];

  return {
    ...rest,
    data: productTypes,
  };
}
