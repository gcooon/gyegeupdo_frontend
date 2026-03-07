'use client';

import { useQuery } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { Product, ProductListResponse, ProductDetail, ProductFilters } from '@/types/model';
import { getMockProduct, getMockProductsByCategory } from '@/lib/mockProducts';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
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
      } catch {
        // API 실패 시 Mock 데이터 반환
        const mockProducts = filters?.category ? getMockProductsByCategory(filters.category) : [];
        return {
          count: mockProducts.length,
          results: mockProducts as unknown as Product[],
        };
      }
    },
  });
}

export function useProduct(slug: string, initialData?: ProductDetail) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<ProductDetail>>(`/products/${slug}/`);
        return response.data.data;
      } catch {
        // API 실패 시 Mock 데이터 반환
        const mockProduct = getMockProduct(slug);
        if (mockProduct) {
          return mockProduct;
        }
        throw new Error('Product not found');
      }
    },
    enabled: !!slug,
    retry: false, // Mock 데이터를 바로 사용하기 위해 재시도 비활성화
    initialData,
  });
}

export function useProductComparison(slugA: string, slugB: string) {
  return useQuery({
    queryKey: ['product-compare', slugA, slugB],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<{
          model_a: ProductDetail;
          model_b: ProductDetail;
          vote_a: number;
          vote_b: number;
        }>>(`/products/compare/?models=${slugA},${slugB}`);
        return response.data.data;
      } catch {
        // API 실패 시 Mock 데이터 반환
        const mockA = getMockProduct(slugA);
        const mockB = getMockProduct(slugB);
        if (mockA && mockB) {
          return {
            model_a: mockA,
            model_b: mockB,
            vote_a: Math.floor(Math.random() * 100) + 50,
            vote_b: Math.floor(Math.random() * 100) + 50,
          };
        }
        throw new Error('Products not found');
      }
    },
    enabled: !!slugA && !!slugB,
    retry: false,
  });
}

// 하위 호환성을 위한 별칭
export const useModels = useProducts;
export const useModel = useProduct;
export const useModelComparison = useProductComparison;
