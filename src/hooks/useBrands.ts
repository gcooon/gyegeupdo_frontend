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
      const response = await api.get<ApiResponse<Category[]>>('/categories/');
      return response.data.data;
    },
  });
}

export function useCategory(slug: string, initialData?: Category) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      // Mock 데이터 우선 체크
      const mockCategory = getMockCategory(slug);
      if (mockCategory) {
        return mockCategory;
      }

      const response = await api.get<ApiResponse<Category>>(`/categories/${slug}/`);
      return response.data.data;
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
      // Mock 데이터 우선 체크
      if (categorySlug) {
        const mockBrands = getMockBrands(categorySlug);
        if (mockBrands) {
          return mockBrands;
        }
      }

      const params = categorySlug ? `?category=${categorySlug}` : '';
      const response = await api.get<ApiResponse<Brand[]>>(`/brands/${params}`);
      return response.data.data;
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
