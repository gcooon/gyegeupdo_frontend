'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import {
  Post,
  PostListItem,
  PostListResponse,
  PostComment,
  PostCommentsResponse,
  CreatePostPayload,
  UpdatePostPayload,
} from '@/types/board';

interface PostFilters {
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// 게시글 목록 조회
export function usePosts(filters?: PostFilters) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.page_size) params.append('page_size', String(filters.page_size));

      const response = await api.get<ApiResponse<PostListResponse>>(
        `/posts/?${params.toString()}`
      );
      return response.data.data;
    },
  });
}

// 게시글 상세 조회
export function usePost(postId: number | string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Post>>(`/posts/${postId}/`);
      return response.data.data;
    },
    enabled: !!postId,
  });
}

// 게시글 작성
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const response = await api.post<ApiResponse<Post>>('/posts/', payload);
      return response.data.data;
    },
    onSuccess: (data) => {
      // 게시글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 게시글 수정
export function useUpdatePost(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePostPayload) => {
      const response = await api.patch<ApiResponse<Post>>(`/posts/${postId}/`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 게시글 삭제
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.delete<ApiResponse<null>>(`/posts/${postId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 게시글 좋아요 토글
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.post<ApiResponse<{ is_liked: boolean; like_count: number }>>(
        `/posts/${postId}/like/`
      );
      return response.data.data;
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

// 게시글 댓글 목록 조회
export function usePostComments(postId: number | string, page = 1) {
  return useQuery({
    queryKey: ['post-comments', postId, page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PostCommentsResponse>>(
        `/posts/${postId}/comments/?page=${page}`
      );
      return response.data.data;
    },
    enabled: !!postId,
  });
}

// 게시글 댓글 작성
export function useCreatePostComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { content: string; parent_id?: number | null }) => {
      const response = await api.post<ApiResponse<PostComment>>(
        `/posts/${postId}/comments/`,
        payload
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

// 게시글 댓글 삭제
export function useDeletePostComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await api.delete<ApiResponse<null>>(
        `/posts/${postId}/comments/${commentId}/`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
