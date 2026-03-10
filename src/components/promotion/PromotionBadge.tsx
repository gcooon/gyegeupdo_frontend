import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Star } from 'lucide-react';
import type { PromotionStatus } from '@/types/tier';

interface PromotionBadgeProps {
  status: PromotionStatus;
  statusDisplay?: string;
  size?: 'sm' | 'default';
}

const PROMOTION_CONFIG: Record<
  PromotionStatus,
  {
    icon: React.ReactNode;
    label: string;
    className: string;
    show: boolean;
  }
> = {
  normal: {
    icon: null,
    label: '일반',
    className: '',
    show: false,
  },
  rising: {
    icon: <TrendingUp className="h-3 w-3" />,
    label: '급상승',
    className: 'bg-amber-500 text-white hover:bg-amber-600',
    show: true,
  },
  candidate: {
    icon: <Award className="h-3 w-3" />,
    label: '승급 후보',
    className: 'bg-emerald-500 text-white hover:bg-emerald-600 animate-pulse',
    show: true,
  },
  promoted: {
    icon: <Star className="h-3 w-3" />,
    label: '추천',
    className: 'bg-blue-500 text-white hover:bg-blue-600',
    show: true,
  },
};

export function PromotionBadge({ status, statusDisplay, size = 'default' }: PromotionBadgeProps) {
  const config = PROMOTION_CONFIG[status];

  if (!config.show) {
    return null;
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs';

  return (
    <Badge className={`${config.className} ${sizeClasses} flex items-center gap-1`}>
      {config.icon}
      <span>{statusDisplay || config.label}</span>
    </Badge>
  );
}
