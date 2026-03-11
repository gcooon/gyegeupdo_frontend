'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useProductComments, useCreateProductComment, useDeleteProductComment } from '@/hooks/useProductComments';
import { useTranslations } from '@/i18n';
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
} from 'lucide-react';
import type { ProductComment } from '@/types/board';

interface ProductCommentsProps {
  productSlug: string;
  categorySlug: string;
}

export function ProductComments({ productSlug, categorySlug }: ProductCommentsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const t = useTranslations('comment');
  const { locale } = useLocaleStore();

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useProductComments(productSlug, page);
  const createComment = useCreateProductComment(productSlug);
  const deleteComment = useDeleteProductComment(productSlug);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return;

    try {
      await createComment.mutateAsync({ content: commentText.trim() });
      setCommentText('');
      refetch();
    } catch {
      // 에러 무시
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyText.trim() || !isAuthenticated) return;

    try {
      await createComment.mutateAsync({
        content: replyText.trim(),
        parent_id: parentId,
      });
      setReplyText('');
      setReplyingTo(null);
      refetch();
    } catch {
      // 에러 무시
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment.mutateAsync(commentId);
      refetch();
    } catch {
      // 에러 무시
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('title')} {data?.total_count || 0}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 댓글 작성 */}
        {isAuthenticated ? (
          <div className="flex gap-2">
            <Textarea
              placeholder={t('placeholder')}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || createComment.isPending}
              className="bg-accent hover:bg-accent/90"
            >
              {createComment.isPending ? (
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
                {t('loginRequired')}
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

        {/* 댓글 목록 */}
        {!isLoading && data && (
          <div className="space-y-4">
            {data.items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {t('beFirst')}
              </p>
            ) : (
              data.items.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  onReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  onReplyTextChange={setReplyText}
                  onSubmitReply={handleSubmitReply}
                  isSubmittingReply={createComment.isPending}
                  isAuthenticated={isAuthenticated}
                  locale={locale}
                />
              ))
            )}

            {/* 더보기 */}
            {data.has_next && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPage((p) => p + 1)}
              >
                더 보기
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CommentItemProps {
  comment: ProductComment;
  onDelete: (id: number) => void;
  onReply: (id: number) => void;
  replyingTo: number | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: (parentId: number) => void;
  isSubmittingReply: boolean;
  isAuthenticated: boolean;
  locale: string;
}

function CommentItem({
  comment,
  onDelete,
  onReply,
  replyingTo,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isSubmittingReply,
  isAuthenticated,
  locale,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const isReplying = replyingTo === comment.id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'verified':
        return 'bg-blue-500';
      case 'reviewer':
        return 'bg-green-500';
      case 'master':
        return 'bg-purple-500';
      case 'pioneer':
        return 'bg-amber-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {comment.user.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{comment.user.username}</span>
            {comment.user.badge && comment.user.badge !== 'none' && (
              <Badge className={`text-xs ${getBadgeVariant(comment.user.badge)}`}>
                {comment.user.badge}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: locale === 'ko' ? ko : enUS,
              })}
            </span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2 mt-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-accent"
              >
                <Reply className="h-3 w-3 mr-1" />
                답글
              </Button>
            )}
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="h-6 px-2 text-xs text-muted-foreground"
              >
                {showReplies ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1" />
                )}
                답글 {comment.replies.length}개
              </Button>
            )}
            {comment.is_owner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* 답글 입력 */}
          {isReplying && (
            <div className="flex gap-2 mt-2">
              <Textarea
                placeholder="답글을 입력하세요..."
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                rows={2}
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => onSubmitReply(comment.id)}
                disabled={!replyText.trim() || isSubmittingReply}
                size="sm"
                className="bg-accent hover:bg-accent/90"
              >
                {isSubmittingReply ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 답글 목록 */}
      {showReplies && hasReplies && (
        <div className="ml-11 space-y-3 border-l-2 border-muted pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {reply.user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-xs">{reply.user.username}</span>
                  {reply.user.badge && reply.user.badge !== 'none' && (
                    <Badge className={`text-[10px] ${getBadgeVariant(reply.user.badge)}`}>
                      {reply.user.badge}
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.created_at), {
                      addSuffix: true,
                      locale: locale === 'ko' ? ko : enUS,
                    })}
                  </span>
                  {reply.is_owner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(reply.id)}
                      className="h-5 px-1 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs mt-1">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductComments;
