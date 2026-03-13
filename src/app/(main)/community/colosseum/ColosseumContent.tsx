'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import {
  Swords,
  ChevronUp,
  ChevronDown,
  Users,
  Clock,
  MessageCircle,
  Filter,
  Loader2,
  Info,
  Trophy,
} from 'lucide-react';
import type { TierLevel } from '@/lib/tier';
import { useActiveDisputes, useDisputeVote, DisputeListResponse } from '@/hooks/useDisputes';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { NAV_CATEGORIES } from '@/config/categories';

type FilterCategory = 'all' | string;

export function ColosseumContent() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const { data: disputes, isLoading, error } = useActiveDisputes(
    selectedCategory === 'all' ? undefined : selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 mb-4">
          <Swords className="h-5 w-5" />
          <span className="font-semibold">콜로세움</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">등급 이의제기 투표</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          커뮤니티의 힘으로 제품 등급을 조정합니다.
          <br />
          찬성/반대 투표에 참여하여 공정한 등급 결정에 기여하세요.
        </p>
      </div>

      {/* 투표 안내 */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-600 mb-1">투표 참여 방법</p>
              <ul className="text-muted-foreground space-y-1">
                <li>1. 아래 이의제기 목록에서 관심 있는 제품을 선택하세요</li>
                <li>2. 제품 상세 페이지에서 상향/하향 투표에 참여하세요</li>
                <li>3. 1주일 동안 투표를 취합하여 관리자가 등급을 조정합니다</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          전체
        </Button>
        {NAV_CATEGORIES.map((cat) => (
          <Button
            key={cat.slug}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.icon} {cat.name}
          </Button>
        ))}
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">이의제기 목록을 불러오는데 실패했습니다.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      )}

      {/* 이의제기 목록 */}
      {!isLoading && !error && (
        <>
          {disputes && disputes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {disputes.map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {/* 하단 안내 */}
      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <Trophy className="h-10 w-10 mx-auto mb-3 text-amber-500" />
          <h3 className="font-semibold mb-2">이의제기를 신청하고 싶으신가요?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            각 제품 상세 페이지에서 UP/DOWN 투표를 통해 이의제기를 신청할 수 있습니다.
            <br />
            30명 이상의 찬성을 받으면 콜로세움에 등록됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DisputeCard({ dispute }: { dispute: DisputeListResponse }) {
  const { isAuthenticated } = useAuth();
  const voteMutation = useDisputeVote();

  const totalVotes = dispute.support_count + dispute.oppose_count;
  const supportPercent = totalVotes > 0 ? Math.round((dispute.support_count / totalVotes) * 100) : 50;
  const isUpTrending = dispute.dispute_type === 'upgrade';

  const handleVote = async (vote: 'support' | 'oppose') => {
    if (!isAuthenticated) {
      toast.warning('투표하려면 로그인이 필요합니다.');
      return;
    }

    try {
      await voteMutation.mutateAsync({ disputeId: dispute.id, vote });
      toast.success(`${vote === 'support' ? '찬성' : '반대'} 투표가 완료되었습니다.`);
    } catch {
      toast.error('투표에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Card className="hover:border-orange-500/50 transition-colors">
      <CardContent className="p-5">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <TierBadge tier={dispute.product.tier as TierLevel} size="sm" />
            <Badge
              variant="outline"
              className={isUpTrending
                ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
                : 'text-red-600 border-red-500 bg-red-50'
              }
            >
              {isUpTrending ? (
                <><ChevronUp className="h-3 w-3 mr-0.5" />상향 요청</>
              ) : (
                <><ChevronDown className="h-3 w-3 mr-0.5" />하향 요청</>
              )}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            투표 진행 중
          </Badge>
        </div>

        {/* 제품 정보 */}
        <Link
          href={`/${dispute.product.category_slug}/model/${dispute.product.slug}`}
          className="block mb-3 hover:text-accent transition-colors"
        >
          <p className="text-xs text-muted-foreground">{dispute.product.brand.name}</p>
          <h3 className="text-lg font-semibold">{dispute.product.name}</h3>
        </Link>

        {/* 이의 사유 */}
        {dispute.reason && (
          <div className="p-3 bg-muted/50 rounded-lg mb-4">
            <p className="text-sm text-foreground/80 line-clamp-2">
              &quot;{dispute.reason}&quot;
            </p>
            <span className="text-xs text-muted-foreground mt-1 block">
              - {dispute.user.username}
            </span>
          </div>
        )}

        {/* 투표 진행률 */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <ChevronUp className="h-4 w-4" />
              찬성 {supportPercent}%
            </span>
            <span className="text-red-600 font-medium flex items-center gap-1">
              반대 {100 - supportPercent}%
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${supportPercent}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${100 - supportPercent}%` }}
            />
          </div>
        </div>

        {/* 투표 버튼 */}
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${dispute.user_vote === 'support' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : ''}`}
            onClick={() => handleVote('support')}
            disabled={voteMutation.isPending}
          >
            <ChevronUp className="h-4 w-4 mr-1" />
            찬성 ({dispute.support_count})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${dispute.user_vote === 'oppose' ? 'border-red-500 bg-red-50 text-red-600' : ''}`}
            onClick={() => handleVote('oppose')}
            disabled={voteMutation.isPending}
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            반대 ({dispute.oppose_count})
          </Button>
        </div>

        {/* 통계 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{totalVotes}명 투표</span>
          </div>
          <Link
            href={`/${dispute.product.category_slug}/model/${dispute.product.slug}`}
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>의견 보기</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <Swords className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
      <h3 className="text-xl font-semibold mb-2">진행 중인 이의제기가 없습니다</h3>
      <p className="text-muted-foreground mb-6">
        현재 투표가 진행 중인 이의제기가 없습니다.
        <br />
        제품 상세 페이지에서 등급 조정을 요청할 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
