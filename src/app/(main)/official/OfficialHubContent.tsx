'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import {
  Trophy,
  Sparkles,
  GitCompare,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Star,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react';
import type { TierLevel } from '@/lib/tier';
import { useHomeSummary, HomeCategory, HomeDispute, HomeReview } from '@/hooks/useHome';
import { useCategories } from '@/hooks/useBrands';
import type { CategoryListItem, CategoryGroup } from '@/types/model';
import { useTranslations } from '@/i18n';

const CATEGORY_TICKER = [
  { slug: 'running-shoes', name: '러닝화', icon: '👟', color: '#E94560', enabled: true },
  { slug: 'chicken', name: '치킨', icon: '🍗', color: '#FF6B00', enabled: true },
  { slug: 'mens-watch', name: '남자시계', icon: '⌚', color: '#1E3A5F', enabled: true },
  { slug: 'perfume', name: '향수', icon: '🧴', color: '#9C27B0', enabled: false },
  { slug: 'luxury-bag', name: '명품백', icon: '👜', color: '#8B4513', enabled: false },
  { slug: 'camera', name: '카메라', icon: '📷', color: '#607D8B', enabled: false },
];

const FALLBACK_CATEGORIES = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    description: '용도별 계급도',
    color: '#E94560',
    topItems: [
      { name: '노바블라스트 5', tier: 'S' as TierLevel },
      { name: '클리프톤 10', tier: 'A' as TierLevel },
      { name: '젤카야노 31', tier: 'B' as TierLevel },
    ],
    productCount: 45,
    brandCount: 12,
  },
  {
    slug: 'chicken',
    name: '치킨',
    icon: '🍗',
    description: '메뉴별 계급도',
    color: '#FF6B00',
    topItems: [
      { name: '황올치킨', tier: 'S' as TierLevel },
      { name: '교촌오리지날', tier: 'A' as TierLevel },
      { name: '굽네고추', tier: 'B' as TierLevel },
    ],
    productCount: 38,
    brandCount: 15,
  },
  {
    slug: 'mens-watch',
    name: '남자시계',
    icon: '⌚',
    description: '브랜드별 계급도',
    color: '#1E3A5F',
    topItems: [
      { name: '파텍필립', tier: 'S' as TierLevel },
      { name: '롤렉스', tier: 'A' as TierLevel },
      { name: '오메가', tier: 'B' as TierLevel },
    ],
    productCount: 52,
    brandCount: 20,
  },
];

const ALL_HOT_DISPUTES = [
  {
    category: 'running-shoes',
    categoryName: '러닝화',
    categoryIcon: '👟',
    productId: 1,
    productName: '엔돌핀 스피드 5',
    productSlug: 'endorphin-speed-5',
    brandName: '써코니',
    currentTier: 'A' as TierLevel,
    upVotes: 89,
    downVotes: 15,
    totalVotes: 104,
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
    daysLeft: 4,
  },
  {
    category: 'running-shoes',
    categoryName: '러닝화',
    categoryIcon: '👟',
    productId: 2,
    productName: '매그니파이 니트로 3',
    productSlug: 'magnify-nitro-3',
    brandName: '푸마',
    currentTier: 'A' as TierLevel,
    upVotes: 67,
    downVotes: 22,
    totalVotes: 89,
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
    daysLeft: 2,
  },
];

const ALL_RECENT_REVIEWS = [
  {
    id: 1,
    category: 'running-shoes',
    category_icon: '👟',
    user: { name: '러닝좋아', type: '평발 / 넓은 발' },
    product: { name: '노바블라스트 5', brand: '아식스', tier: 'S' as TierLevel, slug: 'novablast-5' },
    rating: 5,
    content: '2025년 최고의 데일리 러닝화! 쿠셔닝과 반발력의 완벽한 균형. 공홈 마비될 정도로 인기 있는 이유를 알겠어요.',
    likes: 156,
    comments: 23,
    created_at: '2시간 전',
  },
  {
    id: 101,
    category: 'chicken',
    category_icon: '🍗',
    user: { name: '치킨마스터', type: '매운맛 좋아함' },
    product: { name: '뿌링클', brand: 'BHC', tier: 'S' as TierLevel, slug: 'bhc-puringkle' },
    rating: 5,
    content: '치즈 시즈닝이 정말 맛있어요. 맥주 안주로 최고입니다. 재주문 확정!',
    likes: 32,
    comments: 7,
    created_at: '1시간 전',
  },
  {
    id: 2,
    category: 'running-shoes',
    category_icon: '👟',
    user: { name: '마라토너K', type: '보통 / 보통 발' },
    product: { name: '메타스피드 스카이 도쿄', brand: '아식스', tier: 'S' as TierLevel, slug: 'metaspeed-sky-tokyo' },
    rating: 5,
    content: '아식스가 레이싱화 왕좌 탈환! FF LEAP 폼 반발력이 미쳤어요. 서브3 도전하시는 분들 강추합니다.',
    likes: 87,
    comments: 15,
    created_at: '5시간 전',
  },
  {
    id: 102,
    category: 'chicken',
    category_icon: '🍗',
    user: { name: '야식킹', type: '바삭함 선호' },
    product: { name: '황금올리브치킨', brand: 'BBQ', tier: 'S' as TierLevel, slug: 'bbq-golden-olive' },
    rating: 5,
    content: '올리브유로 튀겨서 담백하고 바삭해요. 치킨 본연의 맛을 느끼기 좋습니다.',
    likes: 28,
    comments: 4,
    created_at: '3시간 전',
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

export function OfficialHubContent() {
  const { data: homeSummary } = useHomeSummary();
  const { data: apiCategories } = useCategories();
  const t = useTranslations('nav');
  const tOfficial = useTranslations('officialHub');

  const categoryCards: CategoryListItem[] = (apiCategories || []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    group: (c.group || '') as CategoryGroup,
    description: c.description || '',
    display_config: c.display_config || {},
    display_order: c.display_order || 0,
    product_count: c.product_count,
    brand_count: c.brand_count,
  }));

  const categories: HomeCategory[] = homeSummary?.categories?.length
    ? homeSummary.categories
    : FALLBACK_CATEGORIES.map((c) => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        description: c.description,
        color: c.color,
        top_items: c.topItems.map((item) => ({
          name: item.name,
          slug: item.name.toLowerCase().replace(/\s+/g, '-'),
          tier: item.tier,
          score: 0,
          brand_name: '',
          brand_slug: '',
          image_url: '',
          usage: '',
        })),
        trending: '',
      }));

  const disputes: HomeDispute[] = homeSummary?.disputes?.length
    ? homeSummary.disputes
    : ALL_HOT_DISPUTES.map((d) => ({
        id: d.productId,
        category: d.category,
        category_name: d.categoryName,
        category_icon: d.categoryIcon,
        product_id: d.productId,
        product_name: d.productName,
        product_slug: d.productSlug,
        brand_name: d.brandName,
        current_tier: d.currentTier,
        proposed_tier: 'S' as TierLevel,
        up_votes: d.upVotes,
        down_votes: d.downVotes,
        total_votes: d.totalVotes,
        reason: '',
        days_left: d.daysLeft,
      }));

  const reviews: HomeReview[] = homeSummary?.reviews?.length
    ? homeSummary.reviews
    : ALL_RECENT_REVIEWS;

  return (
    <div className="container py-6 max-w-6xl space-y-12">
      {/* 히어로 섹션 */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">{tOfficial('badge')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {tOfficial('title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {tOfficial('subtitle')}
          </p>

          {/* 카테고리 티커 */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-6">
            {CATEGORY_TICKER.map((cat) =>
              cat.enabled ? (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-medium text-xs transition-all hover:scale-105 hover:shadow-sm"
                  style={{
                    borderColor: cat.color,
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                  }}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ) : (
                <span
                  key={cat.slug}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-400 font-medium text-xs cursor-default"
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-[10px]">(준비중)</span>
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* 카테고리 그리드 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{tOfficial('categorySection')}</h2>
              <p className="text-sm text-muted-foreground">{tOfficial('categorySectionDesc')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(categoryCards.length > 0
            ? categoryCards
            : FALLBACK_CATEGORIES.map((c, i) => ({
                id: i,
                name: c.name,
                slug: c.slug,
                icon: c.icon,
                group: '' as CategoryGroup,
                description: c.description,
                display_config: { color: c.color },
                display_order: i,
                product_count: c.productCount,
                brand_count: c.brandCount,
              }))
          ).map((category, index) => {
            const color = category.display_config?.color || '#3B82F6';
            const categoryData = categories.find((c) => c.slug === category.slug);
            const topItems = categoryData?.top_items?.slice(0, 3) || [];

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    {/* 컬러바 */}
                    <div
                      className="h-2"
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
                    />
                    <div className="p-4">
                      {/* 아이콘 + 이름 */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: `${color}15` }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Top 3 미리보기 */}
                      {topItems.length > 0 && (
                        <div className="space-y-1.5 mb-3 text-sm">
                          {topItems.map((item) => (
                            <div key={item.slug} className="flex items-center gap-2">
                              <TierBadge tier={item.tier} size="sm" showLabel={false} />
                              <span className="text-muted-foreground truncate">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 통계 */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        {category.product_count !== undefined && (
                          <span>{category.product_count}개 제품</span>
                        )}
                        {category.brand_count !== undefined && (
                          <>
                            <span className="text-muted">·</span>
                            <span>{category.brand_count}개 브랜드</span>
                          </>
                        )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          style={{ borderColor: `${color}50`, color }}
                          asChild
                        >
                          <Link href={`/${category.slug}/quiz`}>
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            3분 진단
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs text-white"
                          style={{ background: color }}
                          asChild
                        >
                          <Link href={`/${category.slug}`}>계급도</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 퀵 액션 CTA */}
      <section className="py-8 bg-gradient-to-r from-primary/5 to-accent/5 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{tOfficial('quickActions')}</h2>
          <p className="text-muted-foreground">{tOfficial('quickActionsDesc')}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
            <Link href="/running-shoes/quiz">
              <Sparkles className="h-5 w-5 mr-2" />
              3분 진단
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/running-shoes/compare">
              <GitCompare className="h-5 w-5 mr-2" />
              VS 비교
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/running-shoes/board">
              <MessageSquare className="h-5 w-5 mr-2" />
              게시판
            </Link>
          </Button>
        </div>
      </section>

      {/* 커뮤니티 리뷰 */}
      <section className="py-8 bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{tOfficial('communityReviews')}</h2>
              <p className="text-sm text-muted-foreground">{tOfficial('communityReviewsDesc')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/community/reviews">
              {tOfficial('viewAll')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
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
                  <p className="font-semibold text-sm">{tOfficial('writeReview')}</p>
                  <p className="text-xs text-muted-foreground">{tOfficial('writeReviewDesc')}</p>
                </div>
              </div>
              <Button size="sm" className="bg-accent hover:bg-accent/90 shrink-0" asChild>
                <Link href="/review/write">{tOfficial('writeReviewButton')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 그리드 */}
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.slice(0, 4).map((review) => (
            <Card key={review.id} className="card-base">
              <CardContent className="p-4">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{review.category_icon}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{review.user.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{review.user.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{review.created_at}</span>
                </div>

                {/* 제품 링크 */}
                <Link
                  href={`/${review.category}/model/${review.product.slug}`}
                  className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  <span>{review.product.brand} {review.product.name}</span>
                  <TierBadge tier={review.product.tier} size="sm" showLabel={false} />
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

      {/* HOT 이의 섹션 - 맨 아래로 이동 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{tOfficial('hotDisputes')}</h2>
              <p className="text-sm text-muted-foreground">{tOfficial('hotDisputesDesc')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/community/disputes">
              {tOfficial('viewAll')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {disputes.slice(0, 4).map((dispute) => {
            const upPercent =
              dispute.total_votes > 0
                ? Math.round((dispute.up_votes / dispute.total_votes) * 100)
                : 50;
            const isUpTrending = dispute.up_votes > dispute.down_votes;

            return (
              <Link
                key={`${dispute.category}-${dispute.product_id}`}
                href={`/${dispute.category}/model/${dispute.product_slug}`}
              >
                <Card className="card-base h-full hover:border-orange-500/50 transition-all hover:shadow-lg group cursor-pointer">
                  <CardContent className="p-4">
                    {/* 카테고리 아이콘 + 티어 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{dispute.category_icon}</span>
                        <TierBadge tier={dispute.current_tier} size="sm" showLabel={false} />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${
                          isUpTrending
                            ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
                            : 'text-red-600 border-red-500 bg-red-50'
                        }`}
                      >
                        {isUpTrending ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Badge>
                    </div>

                    {/* 제품명 */}
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {dispute.product_name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{dispute.brand_name}</p>

                    {/* 투표 바 */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden flex mb-2">
                      <div className="bg-emerald-500" style={{ width: `${upPercent}%` }} />
                      <div className="bg-red-500" style={{ width: `${100 - upPercent}%` }} />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {dispute.total_votes}명
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dispute.days_left}일
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
