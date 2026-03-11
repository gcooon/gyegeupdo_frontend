'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { TierDispute, DisputeVote } from '@/types/tier';

export interface DisputeListResponse {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    tier: string;
    image_url: string;
    brand: { name: string; slug: string };
    category_slug: string;
  };
  user: {
    id: number;
    username: string;
    badge: string;
  };
  dispute_type: 'upgrade' | 'downgrade';
  reason: string;
  evidence_url?: string;
  support_count: number;
  oppose_count: number;
  status: 'pending' | 'colosseum' | 'resolved' | 'rejected';
  resolution?: string;
  created_at: string;
  resolved_at?: string;
  user_vote?: 'support' | 'oppose' | null;
}

interface DisputeFilters {
  status?: string;
  product?: number;
  category?: string;
}

// 이의제기 목록 조회
export function useDisputes(filters?: DisputeFilters) {
  return useQuery({
    queryKey: ['disputes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.status) params.append('status', filters.status);
      if (filters?.product) params.append('product', String(filters.product));
      if (filters?.category) params.append('category', filters.category);

      const response = await api.get<ApiResponse<DisputeListResponse[]>>(
        `/tiers/disputes/?${params.toString()}`
      );
      return response.data.data;
    },
  });
}

// 이의제기 상세 조회
export function useDispute(disputeId: number) {
  return useQuery({
    queryKey: ['dispute', disputeId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DisputeListResponse>>(
        `/tiers/disputes/${disputeId}/`
      );
      return response.data.data;
    },
    enabled: !!disputeId,
  });
}

// 이의제기 생성
export interface CreateDisputePayload {
  product: number;
  dispute_type: 'upgrade' | 'downgrade';
  reason: string;
  evidence_url?: string;
}

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDisputePayload) => {
      const response = await api.post<ApiResponse<DisputeListResponse>>(
        '/tiers/disputes/',
        payload
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
}

// 이의제기 투표
export function useDisputeVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      disputeId,
      vote,
    }: {
      disputeId: number;
      vote: 'support' | 'oppose';
    }) => {
      const response = await api.post<
        ApiResponse<{ support_count: number; oppose_count: number }>
      >(`/tiers/disputes/${disputeId}/vote/`, { vote });
      return response.data.data;
    },
    onSuccess: (_, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      queryClient.invalidateQueries({ queryKey: ['dispute', disputeId] });
    },
  });
}

// 콜로세움(활성) 이의제기 조회 (support_count >= 30)
export function useActiveDisputes(categorySlug?: string) {
  return useQuery({
    queryKey: ['disputes', 'colosseum', categorySlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('status', 'colosseum');
      if (categorySlug) params.append('category', categorySlug);

      const response = await api.get<ApiResponse<DisputeListResponse[]>>(
        `/tiers/disputes/?${params.toString()}`
      );
      return response.data.data;
    },
  });
}

// 대기 중인 이의제기 조회
export function usePendingDisputes(categorySlug?: string) {
  return useQuery({
    queryKey: ['disputes', 'pending', categorySlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('status', 'pending');
      if (categorySlug) params.append('category', categorySlug);

      const response = await api.get<ApiResponse<DisputeListResponse[]>>(
        `/tiers/disputes/?${params.toString()}`
      );
      return response.data.data;
    },
  });
}

// 특정 제품의 활성 이의제기 조회
export function useProductDispute(productSlug: string) {
  return useQuery({
    queryKey: ['disputes', 'product', productSlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('product_slug', productSlug);
      params.append('status', 'colosseum,pending');

      const response = await api.get<ApiResponse<DisputeListResponse[]>>(
        `/tiers/disputes/?${params.toString()}`
      );
      // 가장 최근 활성 이의제기 반환
      return response.data.data?.[0] || null;
    },
    enabled: !!productSlug,
  });
}
