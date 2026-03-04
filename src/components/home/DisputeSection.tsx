import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import { ChevronUp, ChevronDown, MessageCircle, Users, Clock } from 'lucide-react';
import type { TierLevel } from '@/lib/tier';
import type { DisputeSummary } from '@/types/dispute';

// Mock data - 이의 신청이 많은 제품 2개
const HOT_DISPUTES: DisputeSummary[] = [
  {
    productId: 1,
    productName: '노바블라스트 5',
    productSlug: 'novablast-5',
    brandName: '아식스',
    currentTier: 'A' as TierLevel,
    upVotes: 73,
    downVotes: 12,
    totalVotes: 85,
    topComment: {
      id: 1,
      userId: 1,
      userName: '러닝매니아',
      voteType: 'up',
      comment: '쿠셔닝이 정말 좋고 반발력도 훌륭합니다. S티어 자격 충분해요.',
      createdAt: '2시간 전',
      likes: 15,
    },
    daysLeft: 3,
  },
  {
    productId: 2,
    productName: '클리프톤 10',
    productSlug: 'clifton-10',
    brandName: '호카',
    currentTier: 'A' as TierLevel,
    upVotes: 28,
    downVotes: 45,
    totalVotes: 73,
    topComment: {
      id: 2,
      userId: 2,
      userName: '마라토너K',
      voteType: 'down',
      comment: '내구성이 이전 버전보다 많이 떨어집니다. B티어가 맞다고 봅니다.',
      createdAt: '5시간 전',
      likes: 22,
    },
    daysLeft: 5,
  },
];

export function DisputeSection() {
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

        <div className="grid md:grid-cols-2 gap-6">
          {HOT_DISPUTES.map((dispute) => {
            const upPercent = Math.round((dispute.upVotes / dispute.totalVotes) * 100);
            const downPercent = 100 - upPercent;
            const isUpTrending = dispute.upVotes > dispute.downVotes;

            return (
              <Link key={dispute.productId} href={`/running-shoes/model/${dispute.productSlug}`}>
                <Card className="card-base h-full hover:border-accent/50 transition-colors">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TierBadge tier={dispute.currentTier} size="sm" />
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
                        {dispute.daysLeft}일 남음
                      </Badge>
                    </div>

                    {/* Product Info */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground">{dispute.brandName}</p>
                      <h3 className="text-lg font-semibold">{dispute.productName}</h3>
                    </div>

                    {/* Vote Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <ChevronUp className="h-4 w-4" />
                          UP {upPercent}%
                        </span>
                        <span className="text-red-600 font-medium flex items-center gap-1">
                          DOWN {downPercent}%
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

                    {/* Top Comment */}
                    {dispute.topComment && (
                      <div className="p-3 bg-muted/50 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${dispute.topComment.voteType === 'up'
                              ? 'text-emerald-600 border-emerald-300'
                              : 'text-red-600 border-red-300'
                            }`}
                          >
                            {dispute.topComment.voteType === 'up' ? 'UP' : 'DOWN'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {dispute.topComment.userName}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          &quot;{dispute.topComment.comment}&quot;
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{dispute.totalVotes}명 투표</span>
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
