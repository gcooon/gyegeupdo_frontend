'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Eye, MessageCircle, TrendingUp, Award, Star, Sparkles } from 'lucide-react';
import type { PromotionProgress as PromotionProgressType, PromotionStatus } from '@/types/tier';

interface PromotionProgressProps {
  progress: PromotionProgressType;
}

const STATUS_CONFIG: Record<
  PromotionStatus,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    message: string;
  }
> = {
  normal: {
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500',
    message: '50점 이상 달성 시 급상승 상태가 됩니다!',
  },
  rising: {
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    message: '100점 달성 시 승급 후보가 됩니다!',
  },
  candidate: {
    icon: <Award className="h-5 w-5" />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    message: '운영자 검토 대기 중입니다. 곧 승급될 수 있습니다!',
  },
  promoted: {
    icon: <Star className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    message: '축하합니다! 추천 계급도로 선정되었습니다!',
  },
};

export function PromotionProgress({ progress }: PromotionProgressProps) {
  const config = STATUS_CONFIG[progress.status];
  const hasBreakdown = progress.score_breakdown !== undefined;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={config.color}>{config.icon}</span>
          승격 진행률
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 상태 표시 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.bgColor}`}>
              {progress.status_display}
            </span>
            <span className="text-sm font-semibold">
              {progress.current_score.toFixed(1)}점
            </span>
          </div>
          {progress.target_score && (
            <span className="text-sm text-muted-foreground">
              목표: {progress.target_score}점
            </span>
          )}
        </div>

        {/* 프로그레스 바 */}
        <div className="space-y-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <Progress
              value={progress.progress_percent}
              className="h-3"
            />
          </motion.div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.progress_percent.toFixed(1)}%</span>
            {progress.target_score && <span>{progress.target_score}점</span>}
          </div>
        </div>

        {/* 점수 breakdown */}
        {hasBreakdown && progress.score_breakdown && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs">좋아요</span>
              </div>
              <p className="text-sm font-medium">+{progress.score_breakdown.likes}점</p>
              <p className="text-[10px] text-muted-foreground">×3점</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">조회</span>
              </div>
              <p className="text-sm font-medium">+{progress.score_breakdown.views}점</p>
              <p className="text-[10px] text-muted-foreground">×0.1점</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">댓글</span>
              </div>
              <p className="text-sm font-medium">+{progress.score_breakdown.comments}점</p>
              <p className="text-[10px] text-muted-foreground">×5점</p>
            </div>
          </div>
        )}

        {/* 상태 메시지 */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          {config.message}
        </p>
      </CardContent>
    </Card>
  );
}
