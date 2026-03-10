'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Eye, MessageCircle, TrendingUp, Award, Star, Sparkles } from 'lucide-react';
import { useTranslations } from '@/i18n';
import type { PromotionProgress as PromotionProgressType, PromotionStatus } from '@/types/tier';

interface PromotionProgressProps {
  progress: PromotionProgressType;
}

const STATUS_STYLES: Record<
  PromotionStatus,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    messageKey: string;
  }
> = {
  normal: {
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500',
    messageKey: 'normalMessage',
  },
  rising: {
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    messageKey: 'risingMessage',
  },
  candidate: {
    icon: <Award className="h-5 w-5" />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    messageKey: 'candidateMessage',
  },
  promoted: {
    icon: <Star className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    messageKey: 'promotedMessage',
  },
};

export function PromotionProgress({ progress }: PromotionProgressProps) {
  const t = useTranslations('promotion');
  const style = STATUS_STYLES[progress.status];
  const hasBreakdown = progress.score_breakdown !== undefined;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={style.color}>{style.icon}</span>
          {t('progressTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 상태 표시 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${style.bgColor}`}>
              {progress.status_display || t(progress.status)}
            </span>
            <span className="text-sm font-semibold">
              {progress.current_score.toFixed(1)}{t('points')}
            </span>
          </div>
          {progress.target_score && (
            <span className="text-sm text-muted-foreground">
              {t('target')}: {progress.target_score}{t('points')}
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
            {progress.target_score && <span>{progress.target_score}{t('points')}</span>}
          </div>
        </div>

        {/* 점수 breakdown */}
        {hasBreakdown && progress.score_breakdown && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs">{t('likes')}</span>
              </div>
              <p className="text-sm font-medium">+{progress.score_breakdown.likes}{t('points')}</p>
              <p className="text-[10px] text-muted-foreground">{t('multiplier', { value: '3' })}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{t('views')}</span>
              </div>
              <p className="text-sm font-medium">+{progress.score_breakdown.views}{t('points')}</p>
              <p className="text-[10px] text-muted-foreground">{t('multiplier', { value: '0.1' })}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{t('comments')}</span>
              </div>
              <p className="text-sm font-medium">+{progress.score_breakdown.comments}{t('points')}</p>
              <p className="text-[10px] text-muted-foreground">{t('multiplier', { value: '5' })}</p>
            </div>
          </div>
        )}

        {/* 상태 메시지 */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          {t(style.messageKey)}
        </p>
      </CardContent>
    </Card>
  );
}
