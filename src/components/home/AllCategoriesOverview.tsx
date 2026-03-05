'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import {
  Crown,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Users,
  MessageCircle,
  Clock,
  Star,
  ThumbsUp,
  Trophy,
} from 'lucide-react';
import type { TierLevel } from '@/lib/tier';

// 카테고리 티커 데이터
const CATEGORY_TICKER = [
  { slug: 'running-shoes', name: '러닝화', icon: '👟', color: '#E94560', enabled: true },
  { slug: 'chicken', name: '치킨', icon: '🍗', color: '#FF6B00', enabled: true },
  { slug: 'coffee', name: '커피', icon: '☕', color: '#6B4423', enabled: false },
  { slug: 'laptop', name: '노트북', icon: '💻', color: '#3B82F6', enabled: false },
  { slug: 'earphone', name: '이어폰', icon: '🎧', color: '#8B5CF6', enabled: false },
  { slug: 'camera', name: '카메라', icon: '📷', color: '#10B981', enabled: false },
];

// 카테고리 정보
const CATEGORIES = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    description: '브랜드별 계급도',
    color: '#E94560',
    topItems: [
      { name: '아식스', tier: 'S' as TierLevel, score: 95.0, domain: 'asics.com' },
      { name: '나이키', tier: 'S' as TierLevel, score: 94.0, domain: 'nike.com' },
      { name: '호카', tier: 'S' as TierLevel, score: 92.5, domain: 'hoka.com' },
    ],
    trending: '노바블라스트 5',
  },
  {
    slug: 'chicken',
    name: '치킨',
    icon: '🍗',
    description: '메뉴별 계급도',
    color: '#FF6B00',
    topItems: [
      { name: '황금올리브치킨', tier: 'S' as TierLevel, score: 94.5, domain: 'bbq.co.kr' },
      { name: '교촌 오리지날', tier: 'S' as TierLevel, score: 93.0, domain: 'kyochon.com' },
      { name: '뿌링클', tier: 'S' as TierLevel, score: 92.5, domain: 'bhc.co.kr' },
    ],
    trending: '뿌링클',
  },
];

// 전체 카테고리 HOT 이의 데이터
const ALL_HOT_DISPUTES = [
  {
    category: 'running-shoes',
    categoryName: '러닝화',
    categoryIcon: '👟',
    productId: 1,
    productName: '노바블라스트 5',
    productSlug: 'novablast-5',
    brandName: '아식스',
    currentTier: 'A' as TierLevel,
    upVotes: 73,
    downVotes: 12,
    totalVotes: 85,
    topComment: {
      userName: '러닝매니아',
      voteType: 'up' as const,
      comment: '쿠셔닝이 정말 좋고 반발력도 훌륭합니다. S티어 자격 충분해요.',
    },
    daysLeft: 3,
  },
  {
    category: 'chicken',
    categoryName: '치킨',
    categoryIcon: '🍗',
    productId: 101,
    productName: '굽네 볼케이노',
    productSlug: 'goobne-volcano',
    brandName: '굽네',
    currentTier: 'B' as TierLevel,
    upVotes: 52,
    downVotes: 18,
    totalVotes: 70,
    topComment: {
      userName: '치킨마니아',
      voteType: 'up' as const,
      comment: '매콤한 맛이 정말 중독적이에요. A티어 가치 충분합니다!',
    },
    daysLeft: 4,
  },
  {
    category: 'running-shoes',
    categoryName: '러닝화',
    categoryIcon: '👟',
    productId: 2,
    productName: '클리프톤 10',
    productSlug: 'clifton-10',
    brandName: '호카',
    currentTier: 'A' as TierLevel,
    upVotes: 28,
    downVotes: 45,
    totalVotes: 73,
    topComment: {
      userName: '마라토너K',
      voteType: 'down' as const,
      comment: '내구성이 이전 버전보다 많이 떨어집니다. B티어가 맞다고 봅니다.',
    },
    daysLeft: 5,
  },
  {
    category: 'chicken',
    categoryName: '치킨',
    categoryIcon: '🍗',
    productId: 102,
    productName: '맛초킹',
    productSlug: 'bhc-matchoking',
    brandName: 'BHC',
    currentTier: 'A' as TierLevel,
    upVotes: 35,
    downVotes: 41,
    totalVotes: 76,
    topComment: {
      userName: '야식러버',
      voteType: 'down' as const,
      comment: '양이 좀 아쉽고 가격 대비 만족도가 떨어집니다.',
    },
    daysLeft: 2,
  },
];

// 전체 카테고리 최신 리뷰 데이터
const ALL_RECENT_REVIEWS = [
  {
    id: 1,
    category: 'running-shoes',
    categoryIcon: '👟',
    user: { name: '러닝좋아', type: '평발 / 넓은 발' },
    model: { name: '노바블라스트 5', brand: '아식스', tier: 'A' as TierLevel, slug: 'novablast-5' },
    rating: 5,
    content: '평발인데 아치 서포트가 적당하고 쿠셔닝이 정말 좋아요. 10km 이상 달려도 발이 편합니다.',
    likes: 24,
    comments: 5,
    createdAt: '2시간 전',
  },
  {
    id: 101,
    category: 'chicken',
    categoryIcon: '🍗',
    user: { name: '치킨마스터', type: '매운맛 좋아함' },
    model: { name: '뿌링클', brand: 'BHC', tier: 'S' as TierLevel, slug: 'bhc-puringkle' },
    rating: 5,
    content: '치즈 시즈닝이 정말 맛있어요. 맥주 안주로 최고입니다. 재주문 확정!',
    likes: 32,
    comments: 7,
    createdAt: '1시간 전',
  },
  {
    id: 2,
    category: 'running-shoes',
    categoryIcon: '👟',
    user: { name: '마라토너K', type: '보통 / 보통 발' },
    model: { name: '알파플라이 3', brand: '나이키', tier: 'S' as TierLevel, slug: 'alphafly-3' },
    rating: 4,
    content: '가격이 비싸지만 레이스용으로는 최고입니다. 다만 내구성은 좀 아쉬워요.',
    likes: 18,
    comments: 3,
    createdAt: '5시간 전',
  },
  {
    id: 102,
    category: 'chicken',
    categoryIcon: '🍗',
    user: { name: '야식킹', type: '바삭함 선호' },
    model: { name: '황금올리브치킨', brand: 'BBQ', tier: 'S' as TierLevel, slug: 'bbq-golden-olive' },
    rating: 5,
    content: '올리브유로 튀겨서 담백하고 바삭해요. 치킨 본연의 맛을 느끼기 좋습니다.',
    likes: 28,
    comments: 4,
    createdAt: '3시간 전',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

export function AllCategoriesOverview() {
  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-accent/10 text-accent border border-accent/20">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">커뮤니티 리뷰 기반</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            모든 계급도를<br className="md:hidden" /> 한눈에 비교하세요
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            다양한 카테고리의 제품/서비스를 커뮤니티 리뷰 기반으로 S~B 등급으로 분류했습니다
          </p>

          {/* 카테고리 티커 */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {CATEGORY_TICKER.map((cat) =>
              cat.enabled ? (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm transition-all hover:scale-105 hover:shadow-md"
                  style={{
                    borderColor: cat.color,
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ) : (
                <span
                  key={cat.slug}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 bg-gray-100 text-gray-400 font-medium text-sm cursor-default"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs">(준비중)</span>
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* 카테고리별 계급도 미리보기 */}
      <section className="space-y-8">
        {CATEGORIES.map((category) => (
          <Card key={category.slug} className="card-base overflow-hidden">
            <CardContent className="p-0">
              {/* 카테고리 헤더 */}
              <div
                className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl"
                    style={{ background: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{category.name} 계급도</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* TOP 3 미리보기 */}
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold">TOP 3</span>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                  {category.topItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="relative flex flex-col items-center p-3 md:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {/* 순위 뱃지 */}
                      <div
                        className={`
                          absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center
                          text-xs font-bold text-white shadow-md
                          ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'}
                        `}
                      >
                        {index + 1}
                      </div>

                      {/* 로고 */}
                      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mb-2">
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* 이름 */}
                      <p className="text-xs md:text-sm font-medium text-center line-clamp-1">
                        {item.name}
                      </p>

                      {/* 점수 */}
                      <p className="text-xs text-amber-600 font-bold">
                        {item.score}점
                      </p>
                    </div>
                  ))}
                </div>

                {/* 하단 액션 */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>관심 상승: <strong className="text-foreground">{category.trending}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${category.slug}/quiz`}>
                        <Sparkles className="h-4 w-4 mr-1" />
                        3분 진단
                      </Link>
                    </Button>
                    <Button size="sm" asChild style={{ background: category.color }}>
                      <Link href={`/${category.slug}`}>
                        계급도 보기
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 이번 주 HOT 이의 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">이번 주 HOT 이의</h2>
            <p className="text-muted-foreground">전체 카테고리 등급 조정 투표</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/community/disputes">
              전체 이의 보기
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {ALL_HOT_DISPUTES.map((dispute) => {
            const upPercent = Math.round((dispute.upVotes / dispute.totalVotes) * 100);
            const downPercent = 100 - upPercent;
            const isUpTrending = dispute.upVotes > dispute.downVotes;

            return (
              <Link key={`${dispute.category}-${dispute.productId}`} href={`/${dispute.category}/model/${dispute.productSlug}`}>
                <Card className="card-base h-full hover:border-accent/50 transition-colors">
                  <CardContent className="p-5">
                    {/* 카테고리 + 헤더 */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{dispute.categoryIcon}</span>
                        <TierBadge tier={dispute.currentTier} size="sm" />
                        <Badge
                          variant="outline"
                          className={isUpTrending
                            ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
                            : 'text-red-600 border-red-500 bg-red-50'
                          }
                        >
                          {isUpTrending ? (
                            <><ChevronUp className="h-3 w-3 mr-0.5" />상향</>
                          ) : (
                            <><ChevronDown className="h-3 w-3 mr-0.5" />하향</>
                          )}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {dispute.daysLeft}일
                      </Badge>
                    </div>

                    {/* 제품 정보 */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">{dispute.brandName}</p>
                      <h3 className="font-semibold">{dispute.productName}</h3>
                    </div>

                    {/* 투표 바 */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-600 font-medium">UP {upPercent}%</span>
                        <span className="text-red-600 font-medium">DOWN {downPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500" style={{ width: `${upPercent}%` }} />
                        <div className="bg-red-500" style={{ width: `${downPercent}%` }} />
                      </div>
                    </div>

                    {/* Top Comment */}
                    <div className="p-2 bg-muted/50 rounded-lg mb-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1 py-0 ${dispute.topComment.voteType === 'up'
                            ? 'text-emerald-600 border-emerald-300'
                            : 'text-red-600 border-red-300'
                          }`}
                        >
                          {dispute.topComment.voteType === 'up' ? 'UP' : 'DOWN'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{dispute.topComment.userName}</span>
                      </div>
                      <p className="text-xs text-foreground/80 line-clamp-1">
                        &quot;{dispute.topComment.comment}&quot;
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{dispute.totalVotes}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>의견 보기</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            각 제품 상세 페이지에서 UP/DOWN 투표에 참여할 수 있습니다. 1주일간 투표를 취합하여 등급을 조정합니다.
          </p>
        </div>
      </section>

      {/* 커뮤니티 리뷰 */}
      <section className="py-8 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">커뮤니티 리뷰</h2>
            <p className="text-muted-foreground">전체 카테고리 최신 후기</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/community/reviews">전체 리뷰 보기</Link>
          </Button>
        </div>

        {/* 리뷰 작성 CTA */}
        <Card className="card-base mb-6 border-accent/30 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">내 리뷰 남기기</p>
                  <p className="text-xs text-muted-foreground">다른 사용자들에게 도움이 되는 리뷰를 작성해주세요</p>
                </div>
              </div>
              <Button size="sm" className="bg-accent hover:bg-accent/90 shrink-0" asChild>
                <Link href="/review/write">리뷰 작성하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 그리드 */}
        <div className="grid md:grid-cols-2 gap-4">
          {ALL_RECENT_REVIEWS.map((review) => (
            <Card key={review.id} className="card-base">
              <CardContent className="p-4">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{review.categoryIcon}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{review.user.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{review.user.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{review.createdAt}</span>
                </div>

                {/* 제품 링크 */}
                <Link
                  href={`/${review.category}/model/${review.model.slug}`}
                  className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  <span>{review.model.brand} {review.model.name}</span>
                  <TierBadge tier={review.model.tier} size="sm" showLabel={false} />
                </Link>

                {/* 별점 */}
                <div className="mb-2">
                  <StarRating rating={review.rating} />
                </div>

                {/* 내용 */}
                <p className="text-sm text-foreground/90 mb-3 line-clamp-2">{review.content}</p>

                {/* 액션 */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-accent transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{review.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-accent transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{review.comments}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/community/reviews" className="text-sm text-muted-foreground hover:text-accent transition-colors">
            더 많은 리뷰 보기 →
          </Link>
        </div>
      </section>

    </div>
  );
}
