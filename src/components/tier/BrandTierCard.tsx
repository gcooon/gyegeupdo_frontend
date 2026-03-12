'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Brand } from '@/types/model';
import { TierBadge } from './TierBadge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface BrandTierCardProps {
  brand: Brand;
  category?: string;
  showVoteButtons?: boolean;
}

// Mock vote data - 실제로는 API에서 가져옴
const getMockVotes = (brandId: number) => ({
  upVotes: Math.floor(Math.random() * 50) + 5,
  downVotes: Math.floor(Math.random() * 30) + 2,
});

export function BrandTierCard({ brand, category, showVoteButtons = true }: BrandTierCardProps) {
  const href = category ? `/${category}/brand/${brand.slug}` : `/brand/${brand.slug}`;
  const votes = getMockVotes(brand.id);

  const handleVoteClick = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: API 연동 - 로그인 체크 후 투표 처리
    toast.warning(`${brand.name}에 ${voteType === 'up' ? 'UP' : 'DOWN'} 투표하려면 로그인이 필요합니다.`);
  };

  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <TierBadge tier={brand.tier} size="sm" />
            </div>

            <div className="text-xs text-muted-foreground">
              점수: {brand.tier_score.toFixed(1)}
            </div>

            {/* Vote Buttons */}
            {showVoteButtons && (
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={(e) => handleVoteClick(e, 'up')}
                  className="flex items-center gap-0.5 px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                  title="등급 상향"
                >
                  <ChevronUp className="h-3 w-3" />
                  <span>{votes.upVotes}</span>
                </button>
                <button
                  onClick={(e) => handleVoteClick(e, 'down')}
                  className="flex items-center gap-0.5 px-2 py-1 rounded text-xs bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                  title="등급 하향"
                >
                  <ChevronDown className="h-3 w-3" />
                  <span>{votes.downVotes}</span>
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
