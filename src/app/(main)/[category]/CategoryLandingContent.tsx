'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBrands, useCategory } from '@/hooks/useBrands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import { TIER_CONFIG } from '@/lib/tier';
import type { TierLevel } from '@/lib/tier';
import {
  Crown,
  Medal,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  GitCompare,
  ChevronUp,
  ChevronDown,
  Users,
  MessageCircle,
  Clock,
  Trophy,
  Star,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

interface CategoryLandingContentProps {
  category: string;
}

// 카테고리별 설정
const CATEGORY_CONFIG: Record<string, {
  name: string;
  icon: string;
  color: string;
  heroTitle: string;
  heroDescription: string;
  heroSubDescription: string;
  itemLabel: string;
  quizCTA: string;
  stats: {
    modelCount: string;
    reviewCount: string;
    brandCount: string;
  };
}> = {
  'running-shoes': {
    name: '러닝화',
    icon: '👟',
    color: '#E94560',
    heroTitle: '러닝화 계급도',
    heroDescription: '한눈에 비교하세요',
    heroSubDescription: '커뮤니티 리뷰를 바탕으로 S~B 티어로 분류된 러닝화 순위표',
    itemLabel: '브랜드',
    quizCTA: '나에게 맞는 러닝화 찾기',
    stats: {
      modelCount: '40+',
      reviewCount: '2,500+',
      brandCount: '15',
    },
  },
  'chicken': {
    name: '치킨',
    icon: '🍗',
    color: '#FF6B00',
    heroTitle: '치킨 계급도',
    heroDescription: '한눈에 비교하세요',
    heroSubDescription: '커뮤니티 리뷰를 바탕으로 S~B 티어로 분류된 치킨 메뉴 순위표',
    itemLabel: '메뉴',
    quizCTA: '나에게 맞는 치킨 찾기',
    stats: {
      modelCount: '30+',
      reviewCount: '1,800+',
      brandCount: '10',
    },
  },
};

// Mock 트렌딩 데이터
const TRENDING_DATA: Record<string, { name: string; brand: string; tier: TierLevel; change: string; slug: string }[]> = {
  'running-shoes': [
    { name: '노바블라스트 5', brand: '아식스', tier: 'A', change: '+12.5', slug: 'novablast-5' },
    { name: '클리프톤 10', brand: '호카', tier: 'A', change: '+8.3', slug: 'clifton-10' },
    { name: '페가수스 41', brand: '나이키', tier: 'B', change: '+7.1', slug: 'pegasus-41' },
    { name: '젤 카야노 31', brand: '아식스', tier: 'S', change: '+5.9', slug: 'gel-kayano-31' },
    { name: '1080v14', brand: '뉴발란스', tier: 'B', change: '+4.2', slug: '1080v14' },
  ],
  'chicken': [
    { name: '뿌링클', brand: 'BHC', tier: 'S', change: '+18.2', slug: 'bhc-puringkle' },
    { name: '황금올리브치킨', brand: 'BBQ', tier: 'S', change: '+12.0', slug: 'bbq-golden-olive' },
    { name: '교촌 레드', brand: '교촌', tier: 'A', change: '+9.5', slug: 'kyochon-red' },
    { name: '굽네 고추바사삭', brand: '굽네', tier: 'A', change: '+6.3', slug: 'goobne-gochu' },
    { name: '네네 스노윙', brand: '네네', tier: 'B', change: '+4.1', slug: 'nene-snowing' },
  ],
};

// Mock 이의 데이터 (with top comments)
const DISPUTE_DATA: Record<string, {
  productId: number;
  productName: string;
  productSlug: string;
  brandName: string;
  currentTier: TierLevel;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  topComment: {
    id: number;
    userName: string;
    voteType: 'up' | 'down';
    comment: string;
    createdAt: string;
    likes: number;
  };
  daysLeft: number;
}[]> = {
  'running-shoes': [
    {
      productId: 1,
      productName: '노바블라스트 5',
      productSlug: 'novablast-5',
      brandName: '아식스',
      currentTier: 'A',
      upVotes: 73,
      downVotes: 12,
      totalVotes: 85,
      topComment: {
        id: 1,
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
      currentTier: 'A',
      upVotes: 28,
      downVotes: 45,
      totalVotes: 73,
      topComment: {
        id: 2,
        userName: '마라토너K',
        voteType: 'down',
        comment: '내구성이 이전 버전보다 많이 떨어집니다. B티어가 맞다고 봅니다.',
        createdAt: '5시간 전',
        likes: 22,
      },
      daysLeft: 5,
    },
  ],
  'chicken': [
    {
      productId: 101,
      productName: '굽네 볼케이노',
      productSlug: 'goobne-volcano',
      brandName: '굽네',
      currentTier: 'B',
      upVotes: 52,
      downVotes: 18,
      totalVotes: 70,
      topComment: {
        id: 3,
        userName: '치킨마니아',
        voteType: 'up',
        comment: '매콤한 맛이 정말 중독적이에요. A티어 가치 충분합니다!',
        createdAt: '3시간 전',
        likes: 18,
      },
      daysLeft: 4,
    },
    {
      productId: 102,
      productName: '맛초킹',
      productSlug: 'bhc-matchoking',
      brandName: 'BHC',
      currentTier: 'A',
      upVotes: 35,
      downVotes: 41,
      totalVotes: 76,
      topComment: {
        id: 4,
        userName: '야식러버',
        voteType: 'down',
        comment: '양이 좀 아쉽고 가격 대비 만족도가 떨어집니다.',
        createdAt: '1시간 전',
        likes: 12,
      },
      daysLeft: 2,
    },
  ],
};

// Mock 리뷰 데이터
const REVIEW_DATA: Record<string, {
  id: number;
  user: { name: string; footType: string };
  model: { name: string; brand: string; tier: TierLevel; slug: string };
  rating: number;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}[]> = {
  'running-shoes': [
    {
      id: 1,
      user: { name: '러닝좋아', footType: '평발 / 넓은 발' },
      model: { name: '노바블라스트 5', brand: '아식스', tier: 'A', slug: 'novablast-5' },
      rating: 5,
      content: '평발인데 아치 서포트가 적당하고 쿠셔닝이 정말 좋아요. 10km 이상 달려도 발이 편합니다.',
      likes: 24,
      comments: 5,
      createdAt: '2시간 전',
    },
    {
      id: 2,
      user: { name: '마라토너K', footType: '보통 / 보통 발' },
      model: { name: '알파플라이 3', brand: '나이키', tier: 'S', slug: 'alphafly-3' },
      rating: 4,
      content: '가격이 비싸지만 레이스용으로는 최고입니다. 다만 내구성은 좀 아쉬워요.',
      likes: 18,
      comments: 3,
      createdAt: '5시간 전',
    },
    {
      id: 3,
      user: { name: '초보러너', footType: '오버프로네이션 / 좁은 발' },
      model: { name: '젤 카야노 31', brand: '아식스', tier: 'S', slug: 'gel-kayano-31' },
      rating: 5,
      content: '오버프로네이션 교정이 필요한 분들께 강력 추천합니다. 안정성이 뛰어나요.',
      likes: 31,
      comments: 8,
      createdAt: '1일 전',
    },
    {
      id: 4,
      user: { name: '런런런', footType: '정상 / 보통 발' },
      model: { name: '클리프톤 10', brand: '호카', tier: 'A', slug: 'clifton-10' },
      rating: 4,
      content: '가볍고 쿠셔닝 좋습니다. 다만 통기성이 조금 아쉬워요. 여름에는 덥습니다.',
      likes: 12,
      comments: 2,
      createdAt: '1일 전',
    },
  ],
  'chicken': [
    {
      id: 101,
      user: { name: '치킨마스터', footType: '매운맛 좋아함' },
      model: { name: '뿌링클', brand: 'BHC', tier: 'S', slug: 'bhc-puringkle' },
      rating: 5,
      content: '치즈 시즈닝이 정말 맛있어요. 맥주 안주로 최고입니다. 재주문 확정!',
      likes: 32,
      comments: 7,
      createdAt: '1시간 전',
    },
    {
      id: 102,
      user: { name: '야식킹', footType: '바삭함 선호' },
      model: { name: '황금올리브치킨', brand: 'BBQ', tier: 'S', slug: 'bbq-golden-olive' },
      rating: 5,
      content: '올리브유로 튀겨서 담백하고 바삭해요. 치킨 본연의 맛을 느끼기 좋습니다.',
      likes: 28,
      comments: 4,
      createdAt: '3시간 전',
    },
    {
      id: 103,
      user: { name: '혼닭러버', footType: '가성비 중시' },
      model: { name: '교촌 오리지날', brand: '교촌', tier: 'S', slug: 'kyochon-original' },
      rating: 4,
      content: '간장 소스가 은은하게 배어서 좋아요. 다만 양이 조금 아쉽습니다.',
      likes: 19,
      comments: 3,
      createdAt: '5시간 전',
    },
    {
      id: 104,
      user: { name: '파티플래너', footType: '모임용' },
      model: { name: '굽네 고추바사삭', brand: '굽네', tier: 'A', slug: 'goobne-gochu' },
      rating: 4,
      content: '오븐에 구워서 건강한 느낌이에요. 매콤한 맛이 좋고 살짝 덜 느끼해요.',
      likes: 15,
      comments: 2,
      createdAt: '1일 전',
    },
  ],
};

const TIER_ICONS: Record<TierLevel, React.ElementType | null> = {
  S: Crown,
  A: Medal,
  B: Award,
  C: null,
  D: null,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

export function CategoryLandingContent({ category }: CategoryLandingContentProps) {
  const { data: brands, isLoading } = useBrands(category);
  const { data: categoryData } = useCategory(category);

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['running-shoes'];
  const trending = TRENDING_DATA[category] || [];
  const disputes = DISPUTE_DATA[category] || [];
  const reviews = REVIEW_DATA[category] || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 티어별 브랜드 그룹화
  const brandsByTier: Partial<Record<TierLevel, typeof brands>> = brands?.reduce((acc, brand) => {
    if (!acc[brand.tier]) acc[brand.tier] = [];
    acc[brand.tier]!.push(brand);
    return acc;
  }, {} as Partial<Record<TierLevel, typeof brands>>) || {};

  const tiers: TierLevel[] = ['S', 'A', 'B'];

  return (
    <div className="space-y-12 py-4">
      {/* 히어로 섹션 */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-accent/10 text-accent border border-accent/20">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">{config.stats.reviewCount} 사용자들의 선택</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              {config.name} <span className="text-accent">계급도</span>
              <br />
              {config.heroDescription}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {config.heroSubDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8"
                style={{ background: config.color }}
                asChild
              >
                <Link href={`/${category}/tier`}>
                  계급도 보러가기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                asChild
              >
                <Link href={`/${category}/compare`}>
                  VS 비교하기
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center p-4 rounded-xl bg-card shadow-sm">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{config.stats.modelCount}</p>
                <p className="text-xs text-muted-foreground">등록 {config.itemLabel}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-card shadow-sm">
                <Users className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{config.stats.reviewCount}</p>
                <p className="text-xs text-muted-foreground">사용자 리뷰</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-card shadow-sm">
                <Star className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{config.stats.brandCount}</p>
                <p className="text-xs text-muted-foreground">브랜드</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 관심 상승 TOP 5 */}
      <section className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">관심 상승 TOP5</h2>
            <p className="text-sm text-muted-foreground">다양한 커뮤니티와 검색수 반영</p>
          </div>
          <Link
            href={`/${category}/tier`}
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <Card className="card-base">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              이번 주 관심 급상승
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trending.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/${category}/model/${item.slug}`}
                  className="group flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`
                      w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                      ${index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}
                    `}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm group-hover:text-accent transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TierBadge tier={item.tier} size="sm" showLabel={false} />
                    <span className="text-sm font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {item.change}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 계급도 미리보기 */}
      <section className="py-12 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">{config.name} 계급도</h2>
              <p className="text-muted-foreground">커뮤니티 리뷰 기반</p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/${category}/tier`}>전체 계급도 보기</Link>
            </Button>
          </div>

          <div className="space-y-1 rounded-2xl overflow-hidden shadow-lg">
            {tiers.map((tier) => {
              const tierConfig = TIER_CONFIG[tier];
              const TierIcon = TIER_ICONS[tier];
              const tierBrands = brandsByTier[tier]?.slice(0, 4) || [];
              const isSTier = tier === 'S';
              const isATier = tier === 'A';

              return (
                <div key={tier} className="flex">
                  {/* 티어 라벨 */}
                  <div
                    className="relative flex flex-col items-center justify-center shrink-0 w-16 md:w-24"
                    style={{ background: tierConfig.gradient }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    <span className="font-black text-white drop-shadow-lg relative z-10 text-3xl md:text-4xl">
                      {tier}
                    </span>
                    {TierIcon && (
                      <TierIcon className="text-white/80 mt-0.5 relative z-10 h-4 w-4 md:h-5 md:w-5" />
                    )}
                    {isSTier && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -inset-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                      </div>
                    )}
                  </div>

                  {/* 아이템들 */}
                  <div
                    className={`
                      flex-1 p-2 md:p-3 overflow-x-auto
                      ${isSTier
                        ? 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10'
                        : isATier
                          ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-900/30'
                          : 'bg-gradient-to-r from-orange-50/80 to-orange-50/30 dark:from-orange-950/20 dark:to-orange-950/10'
                      }
                    `}
                  >
                    <div className="flex gap-2 md:gap-3">
                      {tierBrands.map((brand, index) => (
                        <Link
                          key={brand.id}
                          href={category === 'chicken' ? `/${category}/model/${brand.slug}` : `/${category}/brand/${brand.slug}`}
                          className="group shrink-0"
                        >
                          <div className={`
                            relative flex flex-col items-center p-2 md:p-3 rounded-xl
                            bg-white dark:bg-slate-800/80
                            border-2 transition-all duration-200
                            hover:shadow-lg hover:-translate-y-1 hover:border-accent
                            w-[90px] md:w-[100px] h-[130px] md:h-[150px]
                            ${isSTier
                              ? 'border-amber-300 shadow-md'
                              : isATier
                                ? 'border-slate-200 dark:border-slate-600'
                                : 'border-orange-200 dark:border-orange-800/50'
                            }
                          `}>
                            {isSTier && index < 3 && (
                              <div
                                className={`
                                  absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center
                                  text-[10px] md:text-xs font-bold text-white shadow-md
                                  ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'}
                                `}
                              >
                                {index + 1}
                              </div>
                            )}
                            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden mb-1 shrink-0">
                              {brand.logo_url ? (
                                <Image
                                  src={brand.logo_url}
                                  alt={brand.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-sm font-bold">
                                  {brand.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <p className="font-semibold text-center line-clamp-2 w-full group-hover:text-accent transition-colors text-[10px] md:text-xs leading-tight">
                                {brand.name}
                              </p>
                            </div>
                            <p className={`
                              font-bold text-[10px] shrink-0
                              ${isSTier ? 'text-amber-600' : isATier ? 'text-slate-500' : 'text-orange-600/80'}
                            `}>
                              {brand.tier_score.toFixed(1)}점
                            </p>
                          </div>
                        </Link>
                      ))}

                      <Link href={`/${category}/tier?tier=${tier}`} className="shrink-0 self-center">
                        <div className="px-4 py-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground text-sm hover:border-accent hover:text-accent transition-colors">
                          더보기 →
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 범례 */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.S.gradient }} />
              <span>S: 최고</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.A.gradient }} />
              <span>A: 우수</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: TIER_CONFIG.B.gradient }} />
              <span>B: 준수</span>
            </div>
          </div>
        </div>
      </section>

      {/* 이번 주 HOT 이의 */}
      <section className="max-w-5xl mx-auto">
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
          {disputes.map((dispute) => {
            const upPercent = Math.round((dispute.upVotes / dispute.totalVotes) * 100);
            const downPercent = 100 - upPercent;
            const isUpTrending = dispute.upVotes > dispute.downVotes;

            return (
              <Link key={dispute.productId} href={`/${category}/model/${dispute.productSlug}`}>
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
      </section>

      {/* 커뮤니티 리뷰 */}
      <section className="py-12 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">커뮤니티 리뷰</h2>
              <p className="text-muted-foreground">실제 사용자들의 솔직한 후기</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/community/reviews">전체 리뷰 보기</Link>
            </Button>
          </div>

          {/* Write Review CTA Card */}
          <Card className="card-base mb-6 border-accent/30 bg-accent/5">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">내 {config.name} 리뷰 남기기</p>
                    <p className="text-sm text-muted-foreground">
                      다른 사용자들에게 도움이 되는 리뷰를 작성해주세요
                    </p>
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90 shrink-0" asChild>
                  <Link href="/review/write">
                    리뷰 작성하기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <Card key={review.id} className="card-base">
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {review.user.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.user.name}</p>
                        <p className="text-xs text-muted-foreground">{review.user.footType}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                  </div>

                  {/* Product Link */}
                  <Link
                    href={`/${category}/model/${review.model.slug}`}
                    className="flex items-center gap-2 mb-3 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    <span>{review.model.brand} {review.model.name}</span>
                    <TierBadge tier={review.model.tier} size="sm" showLabel={false} />
                  </Link>

                  {/* Rating */}
                  <div className="mb-3">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Content */}
                  <p className="text-sm text-foreground/90 mb-4 line-clamp-2">
                    {review.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{review.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* More Reviews Link */}
          <div className="mt-6 text-center">
            <Link
              href="/community/reviews"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              더 많은 리뷰 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 퀵 메뉴 */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href={`/${category}/tier`}>
            <Card className="card-base text-center py-8 hover:border-accent/50 transition-colors">
              <Crown className="h-10 w-10 mx-auto mb-3 text-amber-500" />
              <p className="font-semibold">계급도 보기</p>
              <p className="text-xs text-muted-foreground mt-1">전체 순위 확인</p>
            </Card>
          </Link>
          <Link href={`/${category}/quiz`}>
            <Card className="card-base text-center py-8 hover:border-accent/50 transition-colors">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-accent" />
              <p className="font-semibold">3분 진단</p>
              <p className="text-xs text-muted-foreground mt-1">{config.quizCTA}</p>
            </Card>
          </Link>
          <Link href={`/${category}/compare`}>
            <Card className="card-base text-center py-8 hover:border-accent/50 transition-colors">
              <GitCompare className="h-10 w-10 mx-auto mb-3 text-blue-500" />
              <p className="font-semibold">VS 비교</p>
              <p className="text-xs text-muted-foreground mt-1">직접 비교해보기</p>
            </Card>
          </Link>
          <Link href={`/${category}/board`}>
            <Card className="card-base text-center py-8 hover:border-accent/50 transition-colors">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 text-green-500" />
              <p className="font-semibold">게시판</p>
              <p className="text-xs text-muted-foreground mt-1">자유로운 토론</p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
