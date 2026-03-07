'use client';

import { useQuery } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { Brand, Product, Category } from '@/types/model';
import { getMockBrands, getMockCategory } from '@/lib/mockData';

// 카테고리 관련 hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<Category[]>>('/categories/');
        if (response.data.data && response.data.data.length > 0) {
          return response.data.data;
        }
      } catch {
        // API 실패 시 무시
      }
      return null;
    },
  });
}

export function useCategory(slug: string, initialData?: Category) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<Category>>(`/categories/${slug}/`);
        if (response.data.data) {
          return response.data.data;
        }
      } catch {
        // API 실패 시 mock 폴백
      }
      const mockCategory = getMockCategory(slug);
      if (mockCategory) return mockCategory;
      throw new Error('Category not found');
    },
    enabled: !!slug,
    initialData,
  });
}

// 브랜드 관련 hooks
export function useBrands(categorySlug?: string, initialData?: Brand[]) {
  return useQuery({
    queryKey: ['brands', categorySlug],
    queryFn: async () => {
      try {
        const params = categorySlug ? `?category=${categorySlug}` : '';
        const response = await api.get<ApiResponse<Brand[]>>(`/brands/${params}`);
        if (response.data.data && response.data.data.length > 0) {
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
        }
      } catch {
        // API 실패 시 mock 폴백
      }
      if (categorySlug) {
        const mockBrands = getMockBrands(categorySlug);
        if (mockBrands) return mockBrands;
      }
      return [];
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
