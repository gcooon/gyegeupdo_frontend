'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import { ProductComment, ProductCommentsResponse, CreateProductCommentPayload } from '@/types/board';

// 제품 댓글 목록 조회
export function useProductComments(productSlug: string, page = 1) {
  return useQuery({
    queryKey: ['product-comments', productSlug, page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductCommentsResponse>>(
        `/products/${productSlug}/comments/?page=${page}`
      );
      return response.data.data;
    },
    enabled: !!productSlug,
  });
}

// 제품 댓글 작성
export function useCreateProductComment(productSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductCommentPayload) => {
      const response = await api.post<ApiResponse<ProductComment>>(
        `/products/${productSlug}/comments/`,
        payload
      );
      return response.data.data;
    },
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['product-comments', productSlug] });
    },
  });
}

// 제품 댓글 삭제
export function useDeleteProductComment(productSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await api.delete<ApiResponse<null>>(
        `/products/${productSlug}/comments/${commentId}/`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-comments', productSlug] });
    },
  });
}
