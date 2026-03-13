// 게시판 관련 타입

export interface PostUser {
  id: number;
  username: string;
  badge: string;
}

export interface PostComment {
  id: number;
  user: PostUser;
  content: string;
  created_at: string;
  replies: PostComment[];
  is_owner: boolean;
}

export type PostTag = 'free' | 'product_review' | 'question';

export interface PostProductInfo {
  id: number;
  name: string;
  slug: string;
  brand_name: string;
  tier?: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface Post {
  id: number;
  title: string;
  tag: PostTag;
  content: string;
  user: PostUser;
  category_slug: string;
  category_name: string;
  product_info: PostProductInfo | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  is_owner: boolean;
  is_liked: boolean;
  rating?: number | null;
  created_at: string;
  updated_at: string;
}

export interface PostListItem {
  id: number;
  title: string;
  tag: PostTag;
  user: PostUser;
  category_slug: string;
  category_name: string;
  product_info: PostProductInfo | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  created_at: string;
  rating?: number | null;
  content_preview?: string | null;
}

export interface PostListResponse {
  count: number;
  results: PostListItem[];
  next: string | null;
  previous: string | null;
}

export interface PostCommentsResponse {
  items: PostComment[];
  total_count: number;
  has_next: boolean;
}

export interface CreatePostPayload {
  title?: string;
  content: string;
  category_slug: string;
  tag?: PostTag;
  product_slug?: string;
  rating?: number;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
}

// 제품 댓글 관련 타입

export interface ProductCommentUser {
  id: number;
  username: string;
  badge: string;
}

export interface ProductComment {
  id: number;
  user: ProductCommentUser;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  replies: ProductComment[];
  is_owner: boolean;
}

export interface ProductCommentsResponse {
  items: ProductComment[];
  total_count: number;
  has_next: boolean;
}

export interface CreateProductCommentPayload {
  content: string;
  parent_id?: number | null;
}
