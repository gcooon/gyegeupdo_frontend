'use client';

import { useQuery } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { Brand, Product, Category } from '@/types/model';

// 카테고리 관련 hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ results: Category[] }>>('/categories/');
      return response.data.data.results;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  });
}

export function useCategory(slug: string, initialData?: Category) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category>>(`/categories/${slug}/`);
      return response.data.data;
    },
    enabled: !!slug,
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

// 브랜드 관련 hooks
export function useBrands(categorySlug?: string, initialData?: Brand[]) {
  return useQuery({
    queryKey: ['brands', categorySlug],
    queryFn: async () => {
      const params = categorySlug ? `?category=${categorySlug}` : '';
      const response = await api.get<ApiResponse<Brand[]>>(`/brands/${params}`);
      // API 응답을 프론트엔드 Brand 타입에 맞게 변환
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data.data.map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logo_url: b.logo_url,
        tier: b.tier,
        tier_score: b.tier_score,
        description: b.description || '',
        category: b.category_slug || categorySlug || '',
        scores: b.scores || [],
      })) as Brand[];
    },
    initialData,
  });
}

export function useBrand(slug: string, initialData?: Brand) {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Brand>>(`/brands/${slug}/`);
      return response.data.data;
    },
    enabled: !!slug,
    initialData,
  });
}

export function useBrandProducts(slug: string) {
  return useQuery({
    queryKey: ['brand-products', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>(`/brands/${slug}/products/`);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

// 하위 호환성
export const useBrandModels = useBrandProducts;

/**
 * 카테고리별 usage 옵션 조회 (filter_definitions에서 추출)
 * - 용도별 계급도 탭 생성에 사용
 */
export function useCategoryUsages(slug: string) {
  const { data: category, ...rest } = useCategory(slug);
  const usages = category?.filter_definitions?.usage || [];
  return { ...rest, data: usages };
}

/**
 * 카테고리별 product_type 옵션 조회
 * - 제품 타입 필터에 사용
 */
export function useCategoryProductTypes(slug: string) {
  const { data: category, ...rest } = useCategory(slug);
  const productTypes = category?.filter_definitions?.product_type || [];
  return { ...rest, data: productTypes };
}
