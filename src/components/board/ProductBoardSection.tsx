'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useCreatePost } from '@/hooks/usePosts';
import { usePostComments, useCreatePostComment, useDeletePostComment } from '@/hooks/usePosts';
import { useLocaleStore } from '@/store/localeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Loader2,
  Send,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Eye,
  ArrowRight,
} from 'lucide-react';
import type { PostListItem } from '@/types/board';

interface ProductBoardSectionProps {
  productSlug: string;
  categorySlug: string;
  productName?: string;
}

export function ProductBoardSection({ productSlug, categorySlug, productName }: ProductBoardSectionProps) {
  const { isAuthenticated } = useAuth();
  const { locale } = useLocaleStore();

  const [commentText, setCommentText] = useState('');
  const [page, setPage] = useState(1);

  // 이 제품과 관련된 게시글 조회
  const { data, isLoading, refetch } = usePosts({
    category: categorySlug,
    product: productSlug,
    page,
    page_size: 10,
  });
  const createPost = useCreatePost();

  // 간편 작성: 텍스트만 입력하면 Post 자동 생성
  const handleSubmitComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return;

    try {
      await createPost.mutateAsync({
        content: commentText.trim(),
        category_slug: categorySlug,
        tag: 'product_review',
        product_slug: productSlug,
        // title은 빈 값 → 백엔드에서 자동 생성
      });
      setCommentText('');
      refetch();
    } catch {
      // 에러 무시
    }
  };

  const posts = data?.results || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            커뮤니티 ({data?.count || 0})
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${categorySlug}/board?tag=product_review`} className="flex items-center gap-1">
              게시판에서 더보기
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 간편 작성 UI - 기존 댓글 상자와 동일한 UX */}
        {isAuthenticated ? (
          <div className="flex gap-2">
            <Textarea
              placeholder={`${productName || '이 제품'}에 대한 의견을 남겨보세요...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || createPost.isPending}
              className="bg-accent hover:bg-accent/90"
            >
              {createPost.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              <Link
                href={`/login?redirect=/${categorySlug}/model/${productSlug}`}
                className="text-accent underline"
              >
                로그인하면 의견을 남길 수 있습니다
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        )}

        {/* 게시글 목록 (간결한 카드형) */}
        {!isLoading && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                아직 후기가 없습니다. 첫 번째 의견을 남겨보세요!
              </p>
            ) : (
              posts.map((post) => (
                <ProductPostCard
                  key={post.id}
                  post={post}
                  category={categorySlug}
                  locale={locale}
                />
              ))
            )}

            {/* 더보기 */}
            {data && data.count > 10 && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${categorySlug}/board?tag=product_review`}>
                  전체 {data.count}개 글 보기
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductPostCard({
  post,
  category,
  locale,
}: {
  post: PostListItem;
  category: string;
  locale: string;
}) {
  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'verified': return 'bg-blue-500';
      case 'reviewer': return 'bg-green-500';
      case 'master': return 'bg-purple-500';
      case 'pioneer': return 'bg-amber-500';
      default: return '';
    }
  };

  return (
    <Link href={`/${category}/board/${post.id}`}>
      <div className="p-3 rounded-lg border hover:border-accent/50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {post.user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{post.user.username}</span>
              {post.user.badge && post.user.badge !== 'none' && (
                <Badge className={`text-[10px] px-1 py-0 ${getBadgeVariant(post.user.badge)}`}>
                  {post.user.badge}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: locale === 'ko' ? ko : enUS,
                })}
              </span>
            </div>
            <h4 className="text-sm font-medium truncate">{post.title}</h4>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {post.like_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductBoardSection;
