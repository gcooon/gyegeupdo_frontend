'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShareButtons } from '@/components/share/ShareButtons';
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
  Heart,
  Eye,
  MessageCircle,
  Download,
  ChevronLeft,
  Loader2,
  Send,
  Trash2,
  MoreHorizontal,
  Edit,
  Crown,
  Medal,
  Award,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import type { UserTierChart, TierChartComment, TierChartData } from '@/types/tier';

const TIER_ICONS: Record<TierLevel, React.ElementType> = {
  S: Crown,
  A: Medal,
  B: Award,
  C: Sparkles,
  D: Sparkles,
};

const TIERS: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

interface TierChartDetailContentProps {
  slug: string;
}

export function TierChartDetailContent({ slug }: TierChartDetailContentProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [chart, setChart] = useState<UserTierChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState<TierChartComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);

  const tierListRef = useRef<HTMLDivElement>(null);

  // 데이터 로드
  useEffect(() => {
    const fetchChart = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<{
          success: boolean;
          data: UserTierChart;
          message: string;
        }>(`/tiers/user-charts/${slug}/`);

        if (response.data.success) {
          setChart(response.data.data);
          setIsLiked(response.data.data.is_liked);
          setLikeCount(response.data.data.like_count);
          setComments(response.data.data.comments || []);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('계급도를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [slug]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/my-tier/' + slug);
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await api.post<{
        success: boolean;
        data: { is_liked: boolean; like_count: number };
        message: string;
      }>(`/tiers/user-charts/${slug}/like/`);

      if (response.data.success) {
        setIsLiked(response.data.data.is_liked);
        setLikeCount(response.data.data.like_count);
      }
    } catch {
      // 에러 무시
    } finally {
      setIsLiking(false);
    }
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return;

    setIsSubmittingComment(true);
    try {
      const response = await api.post<{
        success: boolean;
        data: TierChartComment;
        message: string;
      }>(`/tiers/user-charts/${slug}/comments/`, {
        content: commentText.trim(),
      });

      if (response.data.success) {
        setComments((prev) => [response.data.data, ...prev]);
        setCommentText('');
        if (chart) {
          setChart({ ...chart, comment_count: chart.comment_count + 1 });
        }
      }
    } catch {
      // 에러 무시
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await api.delete<{
        success: boolean;
        message: string;
      }>(`/tiers/user-charts/${slug}/comments/${commentId}/`);

      if (response.data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        if (chart) {
          setChart({ ...chart, comment_count: chart.comment_count - 1 });
        }
      }
    } catch {
      // 에러 무시
    }
  };

  // 계급도 삭제
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete<{
        success: boolean;
        message: string;
      }>(`/tiers/user-charts/${slug}/`);

      if (response.data.success) {
        router.push('/my-tier');
      }
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // 이미지 다운로드
  const handleDownload = async () => {
    if (!tierListRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#1F2937',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${chart?.title || '계급도'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !chart) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || '계급도를 찾을 수 없습니다.'}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/my-tier">목록으로</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      {/* 뒤로가기 */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/my-tier">
          <ChevronLeft className="h-4 w-4 mr-1" />
          목록으로
        </Link>
      </Button>

      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{chart.title}</h1>
            {chart.description && (
              <p className="text-muted-foreground mt-2">{chart.description}</p>
            )}
          </div>
          {chart.is_featured && (
            <Badge className="bg-amber-500 text-white shrink-0">
              <Crown className="h-3 w-3 mr-1" />
              추천
            </Badge>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Badge variant="outline">{chart.user_nickname}</Badge>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {chart.view_count}
          </span>
          <span>
            {formatDistanceToNow(new Date(chart.created_at), { addSuffix: true, locale: ko })}
          </span>
        </div>
      </div>

      {/* 티어 차트 */}
      <div ref={tierListRef} className="rounded-xl overflow-hidden shadow-lg mb-6 bg-slate-900">
        {/* 제목 */}
        <div className="bg-gradient-to-r from-accent to-primary p-4 text-center">
          <h2 className="text-xl font-bold text-white">{chart.title}</h2>
        </div>

        {/* 티어 */}
        {TIERS.map((tier) => {
          const config = TIER_CONFIG[tier];
          const items = (chart.tier_data as TierChartData)[tier] || [];

          return (
            <div key={tier} className="flex min-h-[60px]">
              <div
                className="w-20 md:w-24 flex flex-col items-center justify-center shrink-0 relative border-r-2 border-white/30"
                style={{ background: config.gradient }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <span className="text-xl relative z-10">{config.emoji}</span>
                <span
                  className="font-black text-lg md:text-xl relative z-10"
                  style={{
                    color: '#fff',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {config.label}
                </span>
                <span
                  className="text-[10px] font-bold relative z-10"
                  style={{
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  ({tier}티어)
                </span>
              </div>
              <div className="flex-1 p-3 bg-slate-800/50 flex flex-wrap gap-2 items-start">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white/10 px-3 py-2 rounded-lg group"
                    >
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      {item.reason && (
                        <div className="text-xs text-white/60 mt-1">{item.reason}</div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm py-2">-</span>
                )}
              </div>
            </div>
          );
        })}

        {/* 워터마크 */}
        <div className="bg-slate-900 text-center py-2 text-xs text-slate-500">
          gyegeupdo.kr
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          onClick={handleLike}
          variant={isLiked ? 'default' : 'outline'}
          disabled={isLiking}
          className={isLiked ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-white' : ''}`} />
          좋아요 {likeCount}
        </Button>

        <Button onClick={handleDownload} variant="outline" disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? '생성 중...' : '이미지 저장'}
        </Button>

        <ShareButtons
          title={chart.title}
          description={chart.description || '나만의 계급도를 만들었어요!'}
          variant="compact"
        />

        {chart.is_owner && (
          <>
            <Button variant="outline" asChild>
              <Link href={`/my-tier/${slug}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-400"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </>
        )}
      </div>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            댓글 {chart.comment_count}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 댓글 작성 */}
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Textarea
                placeholder="댓글을 입력하세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isSubmittingComment}
                className="bg-accent hover:bg-accent/90"
              >
                {isSubmittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                댓글을 작성하려면{' '}
                <Link href={`/login?redirect=/my-tier/${slug}`} className="text-accent underline">
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
                첫 번째 댓글을 남겨보세요!
              </p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  isOwner={chart.is_owner}
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
            <DialogTitle>계급도 삭제</DialogTitle>
            <DialogDescription>
              정말 이 계급도를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CommentItemProps {
  comment: TierChartComment;
  onDelete: (id: number) => void;
  isOwner: boolean;
}

function CommentItem({ comment, onDelete, isOwner }: CommentItemProps) {
  const canDelete = comment.is_owner || isOwner;

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">
          {comment.user_nickname[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.user_nickname}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
          </span>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
              className="h-6 px-2 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
}
