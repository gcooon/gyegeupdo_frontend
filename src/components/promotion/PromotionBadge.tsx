'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Flame, Trophy } from 'lucide-react';
import { useTranslations } from '@/i18n';
import type { PromotionStatus } from '@/types/tier';

interface PromotionBadgeProps {
  status: PromotionStatus;
  statusDisplay?: string;
  size?: 'sm' | 'default';
}

const PROMOTION_STYLES: Record<
  PromotionStatus,
  {
    icon: React.ReactNode;
    className: string;
    show: boolean;
  }
> = {
  normal: {
    icon: null,
    className: '',
    show: false,
  },
  rising: {
    icon: <TrendingUp className="h-3 w-3" />,
    className: 'bg-amber-500 text-white hover:bg-amber-600',
    show: true,
  },
  candidate: {
    icon: <Award className="h-3 w-3" />,
    className: 'bg-emerald-500 text-white hover:bg-emerald-600 animate-pulse',
    show: true,
  },
  promoted: {
    icon: <Flame className="h-3 w-3" />,
    className: 'bg-orange-500 text-white hover:bg-orange-600',
    show: true,
  },
  hall_of_fame: {
    icon: <Trophy className="h-3 w-3" />,
    className: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600',
    show: true,
  },
};

export function PromotionBadge({ status, statusDisplay, size = 'default' }: PromotionBadgeProps) {
  const t = useTranslations('promotion');
  const style = PROMOTION_STYLES[status];

  if (!style.show) {
    return null;
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs';

  // 모바일 친화적: 작은 사이즈에서 candidate는 축약형 사용
  const getLabel = () => {
    if (statusDisplay) return statusDisplay;
    if (size === 'sm' && status === 'candidate') {
      return t('candidateShort');
    }
    return t(status);
  };

  return (
    <Badge className={`${style.className} ${sizeClasses} flex items-center gap-1 whitespace-nowrap shrink-0`}>
      {style.icon}
      <span>{getLabel()}</span>
    </Badge>
  );
}
