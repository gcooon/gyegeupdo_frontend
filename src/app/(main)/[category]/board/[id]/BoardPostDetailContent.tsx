'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Eye,
  Clock,
  User,
  Share2,
  Trash2,
  Edit,
  Loader2,
  Send,
  AlertCircle,
  Star,
} from 'lucide-react';
import { useCategory } from '@/hooks/useBrands';
import {
  usePost,
  useDeletePost,
  useTogglePostLike,
  usePostComments,
  useCreatePostComment,
  useDeletePostComment,
} from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useLocaleStore } from '@/store/localeStore';
import { getCategoryInfo } from '@/config/categories';
import { ShareButtons } from '@/components/share/ShareButtons';
import type { PostComment } from '@/types/board';

interface BoardPostDetailContentProps {
  category: string;
  postId: string;
}

export function BoardPostDetailContent({ category, postId }: BoardPostDetailContentProps) {
  const router = useRouter();
  const { data: categoryData } = useCategory(category);
  const { isAuthenticated, user } = useAuth();
  const { locale } = useLocaleStore();
  const config = getCategoryInfo(categoryData || category);

  const [newComment, setNewComment] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // API 연결
  const { data: post, isLoading, error, refetch } = usePost(Number(postId));
  const deletePost = useDeletePost();
  const toggleLike = useTogglePostLike();
  const { data: commentsData, refetch: refetchComments } = usePostComments(Number(postId));
  const createComment = useCreatePostComment(Number(postId));
  const deleteComment = useDeletePostComment(Number(postId));

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(Number(postId));
      router.push(`/${category}/board`);
    } catch {
      // 에러 처리
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/${category}/board/${postId}`);
      return;
    }
    try {
      await toggleLike.mutateAsync(Number(postId));
      refetch();
    } catch {
      // 에러 처리
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return;
    try {
      await createComment.mutateAsync({ content: newComment.trim() });
      setNewComment('');
      refetchComments();
      refetch();
    } catch {
      // 에러 처리
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
      refetchComments();
      refetch();
    } catch {
      // 에러 처리
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment.mutateAsync(commentId);
      refetchComments();
      refetch();
    } catch {
      // 에러 처리
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">게시글을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">삭제되었거나 존재하지 않는 게시글입니다.</p>
        <Button onClick={() => router.push(`/${category}/board`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          게시판으로 돌아가기
        </Button>
      </div>
    );
  }

  const comments = commentsData?.items || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${category}/board`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {config.icon} {config.name} 게시판
      </Button>

      {/* 게시글 본문 */}
      <Card>
        <CardContent className="p-6">
          {/* 공지사항 태그 */}
          {post.is_notice && (
            <Badge variant="secondary" className="mb-4">
              📌 공지
            </Badge>
          )}

          {/* 제목 */}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {/* 제품 정보 및 별점 (제품후기일 때만 표시) */}
          {post.tag === 'product_review' && post.product_info && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <Link
                  href={`/${category}/model/${post.product_info.slug}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <span className="font-medium">{post.product_info.brand_name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span>{post.product_info.name}</span>
                  {post.product_info.tier && (
                    <Badge
                      variant="outline"
                      className={`ml-1 ${
                        post.product_info.tier === 'S' ? 'border-amber-500 text-amber-500' :
                        post.product_info.tier === 'A' ? 'border-emerald-500 text-emerald-500' :
                        post.product_info.tier === 'B' ? 'border-blue-500 text-blue-500' :
                        post.product_info.tier === 'C' ? 'border-slate-400 text-slate-400' :
                        'border-red-400 text-red-400'
                      }`}
                    >
                      {post.product_info.tier}
                    </Badge>
                  )}
                </Link>
                {post.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= post.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium">{post.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between pb-4 border-b mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.user.username}</span>
                  {post.user.badge && post.user.badge !== 'none' && (
                    <Badge variant="outline" className="text-xs">
                      {post.user.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: locale === 'ko' ? ko : enUS,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    조회 {post.view_count}
                  </span>
                </div>
              </div>
            </div>

            {/* 작성자 메뉴 */}
            {post.is_owner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/${category}/board/${postId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              </div>
            )}
          </div>

          {/* 본문 내용 */}
          <div className="prose prose-sm max-w-none dark:prose-invert mb-6 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* 좋아요 및 액션 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant={post.is_liked ? 'default' : 'outline'}
              size="sm"
              onClick={handleLike}
              disabled={toggleLike.isPending}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              {post.like_count}
            </Button>
            <ShareButtons
              title={post.title}
              description={post.content.slice(0, 100)}
              variant="compact"
            />
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 {post.comment_count}개
          </h2>

          {/* 댓글 작성 */}
          {isAuthenticated ? (
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="댓글을 작성해주세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="mb-2"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || createComment.isPending}
                    className="gap-2"
                  >
                    {createComment.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    등록
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                댓글을 작성하려면{' '}
                <Link href={`/login?redirect=/${category}/board/${postId}`} className="text-accent underline">
                  로그인
                </Link>
                이 필요합니다.
              </AlertDescription>
            </Alert>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                첫 번째 댓글을 작성해보세요!
              </p>
            ) : (
              comments.map((comment) => (
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
          </div>
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>
              정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePost.isPending}
            >
              {deletePost.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CommentItemProps {
  comment: PostComment;
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
  const isReplying = replyingTo === comment.id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-xs font-medium">
            {comment.user.username[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-sm">{comment.user.username}</span>
            {comment.user.badge && comment.user.badge !== 'none' && (
              <Badge variant="outline" className="text-xs">
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
          <p className="text-sm mb-2">{comment.content}</p>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {isAuthenticated && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 hover:text-accent"
              >
                <MessageSquare className="h-3 w-3" />
                답글
              </button>
            )}
            {comment.is_owner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
                삭제
              </button>
            )}
          </div>

          {/* 답글 작성 폼 */}
          {isReplying && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="답글을 작성해주세요..."
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                rows={2}
                className="text-sm flex-1"
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={!replyText.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    '등록'
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onReply(comment.id);
                    onReplyTextChange('');
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          )}

          {/* 대댓글 */}
          {hasReplies && (
            <div className="mt-4 ml-4 pl-4 border-l-2 border-muted space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-medium">
                      {reply.user.username[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-xs">{reply.user.username}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.created_at), {
                          addSuffix: true,
                          locale: locale === 'ko' ? ko : enUS,
                        })}
                      </span>
                      {reply.is_owner && (
                        <button
                          onClick={() => onDelete(reply.id)}
                          className="text-[10px] text-muted-foreground hover:text-red-500"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="text-xs">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
