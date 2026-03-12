'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { useTranslations } from '@/i18n';
import { useLocaleStore } from '@/store/localeStore';
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
  AlertCircle,
} from 'lucide-react';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import { getMockUserTierChart } from '@/lib/mockUserTierCharts';
import { PromotionBadge, PromotionProgress } from '@/components/promotion';
import type { UserTierChart, TierChartComment, TierChartData } from '@/types/tier';

const TIERS: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

interface TierChartDetailContentProps {
  slug: string;
  initialChart?: import('@/types/tier').UserTierChart;
}

export function TierChartDetailContent({ slug, initialChart }: TierChartDetailContentProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const t = useTranslations('tierChart');
  const tCommon = useTranslations('common');
  const tComment = useTranslations('comment');
  const tStats = useTranslations('stats');
  const { locale } = useLocaleStore();

  const [chart, setChart] = useState<UserTierChart | null>(initialChart || null);
  const [isLoading, setIsLoading] = useState(!initialChart);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(initialChart?.is_liked || false);
  const [likeCount, setLikeCount] = useState(initialChart?.like_count || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState<TierChartComment[]>(initialChart?.comments || []);
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
        // Mock 데이터 우선 체크
        const mockChart = getMockUserTierChart(slug);
        if (mockChart) {
          setChart(mockChart);
          setIsLiked(mockChart.is_liked);
          setLikeCount(mockChart.like_count);
          setComments(mockChart.comments || []);
          setIsLoading(false);
          return;
        }

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
        // API 실패 시 mock fallback
        const mockChart = getMockUserTierChart(slug);
        if (mockChart) {
          setChart(mockChart);
          setIsLiked(mockChart.is_liked);
          setLikeCount(mockChart.like_count);
          setComments(mockChart.comments || []);
        } else {
          setError(t('loadError'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [slug]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/open/' + slug);
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
        router.push('/open');
      }
    } catch {
      alert(t('deleteFailed'));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // 이미지 다운로드
  const handleDownload = async () => {
    if (!tierListRef.current) {
      alert('캡처할 영역을 찾을 수 없습니다.');
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#1F2937',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          // oklab 색상을 지원하지 않는 html2canvas를 위해 스타일 변환
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const computed = window.getComputedStyle(el);
            const styles = ['color', 'backgroundColor', 'borderColor'];
            styles.forEach((prop) => {
              const value = computed.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
              if (value && value.includes('oklab')) {
                (el as HTMLElement).style.setProperty(
                  prop.replace(/([A-Z])/g, '-$1').toLowerCase(),
                  prop === 'backgroundColor' ? '#1F2937' : '#ffffff'
                );
              }
            });
          });
        },
      });

      const link = document.createElement('a');
      link.download = `${chart?.title || '계급도'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Image generation failed:', err);
      alert(`이미지 생성 실패: ${errorMessage}`);
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
          <AlertDescription>{error || t('notFound')}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/open">{t('backToList')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      {/* 뒤로가기 */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/open">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('backToList')}
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
          <div className="flex gap-2 shrink-0">
            {chart.promotion_status && chart.promotion_status !== 'normal' && (
              <PromotionBadge
                status={chart.promotion_status}
                statusDisplay={chart.promotion_status_display}
              />
            )}
            {chart.is_featured && (
              <Badge className="bg-amber-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                {t('featured')}
              </Badge>
            )}
          </div>
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
            {formatDistanceToNow(new Date(chart.created_at), { addSuffix: true, locale: locale === 'ko' ? ko : enUS })}
          </span>
        </div>
      </div>

      {/* 티어 차트 */}
      <div ref={tierListRef} data-tier-chart className="rounded-2xl overflow-hidden shadow-lg mb-6">
        {/* 제목 */}
        <div className="bg-gradient-to-r from-accent to-primary p-4 text-center">
          <h2 className="text-xl font-bold text-white">{chart.title}</h2>
        </div>

        {/* 티어 */}
        {TIERS.map((tier) => {
          const config = TIER_CONFIG[tier];
          const items = (chart.tier_data as TierChartData)[tier] || [];

          return (
            <div key={tier} className="flex border-b last:border-b-0">
              {/* 티어 라벨 */}
              <div
                className="w-16 shrink-0 flex items-center justify-center"
                style={{ backgroundColor: config.color }}
              >
                <span className={`text-lg font-black ${tier === 'S' ? 'text-black' : 'text-white'}`}>
                  {config.label}
                </span>
              </div>

              {/* 아이템 영역 */}
              <div className="flex-1 p-2 bg-muted/30 flex flex-wrap gap-1.5 min-h-[60px] items-center">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card border rounded-lg px-3 py-2 hover:border-accent hover:shadow-md transition-all"
                    >
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      {item.reason && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.reason}</p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">-</span>
                )}
              </div>
            </div>
          );
        })}

        {/* 워터마크 */}
        <div className="bg-muted/50 text-center py-2 text-xs text-muted-foreground">
          tier-chart.com
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
          {tStats('likes')} {likeCount}
        </Button>

        <Button onClick={handleDownload} variant="outline" disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? t('downloadingImage') : t('downloadImage')}
        </Button>

        <ShareButtons
          title={chart.title}
          description={chart.description || t('shareDesc')}
          variant="compact"
        />

        {chart.is_owner && (
          <>
            <Button variant="outline" asChild>
              <Link href={`/open/${slug}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                {tCommon('edit')}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-400"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {tCommon('delete')}
            </Button>
          </>
        )}
      </div>

      {/* 승격 진행률 */}
      {chart.promotion_progress && (
        <div className="mb-6">
          <PromotionProgress progress={chart.promotion_progress} />
        </div>
      )}

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {tComment('title')} {chart.comment_count}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 댓글 작성 */}
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Textarea
                placeholder={tComment('placeholder')}
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
                <Link href={`/login?redirect=/open/${slug}`} className="text-accent underline">
                  {tComment('loginRequired')}
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {tComment('beFirst')}
              </p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  isOwner={chart.is_owner}
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
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {tCommon('delete')}
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
  locale: string;
}

function CommentItem({ comment, onDelete, isOwner, locale }: CommentItemProps) {
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
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: locale === 'ko' ? ko : enUS })}
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
