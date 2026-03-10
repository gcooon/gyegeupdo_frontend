'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Star } from 'lucide-react';
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
    icon: <Star className="h-3 w-3" />,
    className: 'bg-blue-500 text-white hover:bg-blue-600',
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
  const label = statusDisplay || t(status);

  return (
    <Badge className={`${style.className} ${sizeClasses} flex items-center gap-1`}>
      {style.icon}
      <span>{label}</span>
    </Badge>
  );
}
