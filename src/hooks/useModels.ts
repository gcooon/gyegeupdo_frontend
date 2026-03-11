'use client';

import { useQuery } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { Product, ProductListResponse, ProductDetail, ProductFilters } from '@/types/model';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.category) params.append('category', filters.category);
      if (filters?.tier?.length) params.append('tier', filters.tier.join(','));
      if (filters?.product_type) params.append('product_type', filters.product_type);
      if (filters?.usage) params.append('usage', filters.usage);
      if (filters?.price_max) params.append('price_max', String(filters.price_max));
      if (filters?.brand) params.append('brand', filters.brand);
      if (filters?.page) params.append('page', String(filters.page));

      const response = await api.get<ApiResponse<ProductListResponse>>(`/products/?${params.toString()}`);
      return response.data.data;
    },
  });
}

export function useProduct(slug: string, initialData?: ProductDetail) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductDetail>>(`/products/${slug}/`);
      return response.data.data;
    },
    enabled: !!slug,
    initialData,
  });
}

export function useProductComparison(slugA: string, slugB: string) {
  return useQuery({
    queryKey: ['product-compare', slugA, slugB],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{
        model_a: ProductDetail;
        model_b: ProductDetail;
        vote_a: number;
        vote_b: number;
      }>>(`/products/compare/?models=${slugA},${slugB}`);
      return response.data.data;
    },
    enabled: !!slugA && !!slugB,
  });
}

// 용도별 제품 조회 훅 (계급도 용도별 탭에서 사용)
export function useUsageProducts(category: string, usage: string) {
  return useQuery({
    queryKey: ['products', 'usage', category, usage],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductListResponse>>(
        `/products/?category=${category}&usage=${usage}`
      );
      return response.data.data.results;
    },
    enabled: !!category && !!usage,
  });
}

// 카테고리별 전체 제품 (티어별 그룹화용)
export function useCategoryProducts(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductListResponse>>(
        `/products/?category=${category}&page_size=500`
      );
      return response.data.data.results;
    },
    enabled: !!category,
  });
}

// 하위 호환성을 위한 별칭
export const useModels = useProducts;
export const useModel = useProduct;
export const useModelComparison = useProductComparison;
