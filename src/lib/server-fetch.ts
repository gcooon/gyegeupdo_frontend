/**
 * 서버 사이드 전용 데이터 fetch 유틸리티
 * - Server Component에서 사용 (page.tsx의 generateMetadata, default export)
 * - HydrationBoundary를 통한 SSR prefetch에 사용
 * - 클라이언트 훅(usePosts 등)과 동일한 queryKey를 사용하여 캐시 공유
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * 게시글 목록 서버 사이드 fetch
 */
export async function fetchPosts(filters?: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));

    const response = await fetch(`${API_URL}/posts/?${params.toString()}`, {
      next: { revalidate: 60 }, // 60초 캐시
    });
    if (!response.ok) return null;
    const json: ApiResponse<unknown> = await response.json();
    return json.data;
  } catch {
    return null;
  }
}

/**
 * 게시글 상세 서버 사이드 fetch
 */
export async function fetchPost(postId: string | number) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json: ApiResponse<unknown> = await response.json();
    return json.data;
  } catch {
    return null;
  }
}

/**
 * 게시글 댓글 서버 사이드 fetch
 */
export async function fetchPostComments(postId: string | number, page = 1) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments/?page=${page}`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const json: ApiResponse<unknown> = await response.json();
    return json.data;
  } catch {
    return null;
  }
}
