'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import { ChevronUp, ChevronDown, MessageCircle, Users, Clock, Loader2 } from 'lucide-react';
import type { TierLevel } from '@/lib/tier';
import { useActiveDisputes, DisputeListResponse } from '@/hooks/useDisputes';

export function DisputeSection() {
  const { data: disputes, isLoading } = useActiveDisputes();

  // 데이터가 없으면 섹션 자체를 숨김
  if (!isLoading && (!disputes || disputes.length === 0)) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">이번 주 HOT 이의</h2>
            <p className="text-muted-foreground">커뮤니티 등급 조정 투표</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/community/disputes">
              전체 이의 보기
            </Link>
          </Button>
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}

        {/* 이의 목록 */}
        {!isLoading && disputes && (
          <div className="grid md:grid-cols-2 gap-6">
            {disputes.slice(0, 2).map((dispute: DisputeListResponse) => {
              const totalVotes = dispute.support_count + dispute.oppose_count;
              const upPercent = totalVotes > 0 ? Math.round((dispute.support_count / totalVotes) * 100) : 50;
              const downPercent = 100 - upPercent;
              const isUpTrending = dispute.dispute_type === 'upgrade';

              return (
                <Link
                  key={dispute.id}
                  href={`/${dispute.product.category_slug}/model/${dispute.product.slug}`}
                >
                  <Card className="card-base h-full hover:border-accent/50 transition-colors">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
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
                          {dispute.status === 'colosseum' ? '투표 진행 중' : '검토 중'}
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground">{dispute.product.brand.name}</p>
                        <h3 className="text-lg font-semibold">{dispute.product.name}</h3>
                      </div>

                      {/* Vote Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <ChevronUp className="h-4 w-4" />
                            찬성 {upPercent}%
                          </span>
                          <span className="text-red-600 font-medium flex items-center gap-1">
                            반대 {downPercent}%
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-500 transition-all"
                            style={{ width: `${upPercent}%` }}
                          />
                          <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${downPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Reason */}
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

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          <span>{totalVotes}명 투표</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span>의견 보기</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            각 제품의 상세 페이지에서 UP/DOWN 투표에 참여할 수 있습니다.
            <br />
            1주일간 투표를 취합하여 관리자가 등급을 조정합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
