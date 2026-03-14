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
  Heart,
  Eye,
  Plus,
} from 'lucide-react';
import type { TierLevel } from '@/lib/tier';
import { TIER_CONFIG } from '@/lib/tier';
import { useHomeSummary, HomeCategory, HomeDispute, HomeUserChart } from '@/hooks/useHome';
import { useCategories } from '@/hooks/useBrands';
import { usePosts } from '@/hooks/usePosts';
import type { CategoryListItem, CategoryGroup } from '@/types/model';
import type { PostListItem } from '@/types/board';
import { HotOpenTierCharts } from './HotOpenTierCharts';
import { NAV_CATEGORIES } from '@/config/categories';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// API 실패 시 폴백용 기본 카테고리
const FALLBACK_NAV = NAV_CATEGORIES;

// API 카테고리를 티커 형태로 변환하는 헬퍼
function buildCategoryTicker(apiCategories: { slug: string; name: string; icon: string; display_config?: { color?: string } }[] | undefined) {
  if (apiCategories && apiCategories.length > 0) {
    return apiCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon || '📦',
      color: c.display_config?.color || '#3B82F6',
      enabled: true,
    }));
  }
  // 폴백: 기존 3개 카테고리
  return [
    { slug: 'running-shoes', name: '러닝화', icon: '👟', color: '#E94560', enabled: true },
    { slug: 'chicken', name: '치킨', icon: '🍗', color: '#FF6B00', enabled: true },
    { slug: 'mens-watch', name: '남자시계', icon: '⌚', color: '#1E3A5F', enabled: true },
  ];
}

// API 실패 시 홈 카테고리 폴백 데이터
const FALLBACK_HOME_CATEGORIES = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    description: '용도별 계급도',
    color: '#E94560',
    topItems: [
      { name: '메타스피드 스카이 도쿄', tier: 'S' as TierLevel, score: 98.0, domain: 'asics.com', usage: '레이스/대회' },
      { name: '노바블라스트 5', tier: 'S' as TierLevel, score: 96.0, domain: 'asics.com', usage: '데일리 트레이너' },
      { name: '클리프톤 10', tier: 'S' as TierLevel, score: 96.0, domain: 'hoka.com', usage: '입문/초보' },
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
  {
    slug: 'mens-watch',
    name: '남자시계',
    icon: '⌚',
    description: '브랜드별 계급도',
    color: '#1E3A5F',
    topItems: [
      { name: '파텍 필립', tier: 'S' as TierLevel, score: 99.0, domain: 'patek.com' },
      { name: '롤렉스', tier: 'A' as TierLevel, score: 95.0, domain: 'rolex.com' },
      { name: '오메가', tier: 'B' as TierLevel, score: 88.0, domain: 'omegawatches.com' },
    ],
    trending: '롤렉스',
  },
];

// 전체 카테고리 HOT 이의 데이터
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
    topComment: {
      userName: '러닝매니아',
      voteType: 'up' as const,
      comment: 'INCREDIRUN 폼 반발력이 역대급입니다. S티어 확정이에요!',
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
    productName: '매그니파이 니트로 3',
    productSlug: 'magnify-nitro-3',
    brandName: '푸마',
    currentTier: 'A' as TierLevel,
    upVotes: 67,
    downVotes: 22,
    totalVotes: 89,
    topComment: {
      userName: '마라토너K',
      voteType: 'up' as const,
      comment: '2025년 푸마의 반란! 쿠셔닝과 반응성 둘 다 좋습니다. S티어 가능!',
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
  const { data: homeSummary, isLoading } = useHomeSummary();
  const { data: apiCategories } = useCategories();

  // 최신 리뷰 4개를 /posts/ API에서 직접 가져옴
  const { data: postsData } = usePosts({
    tag: 'product_review',
    page_size: 4,
  });

  // API 카테고리를 CategoryListItem 형태로 변환
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

  // API 카테고리 기반 네비게이션 (폴백 포함)
  const navCategories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon || '📦' }))
    : FALLBACK_NAV;

  // 첫 번째 카테고리 (기본 링크용)
  const defaultCategory = navCategories[0] || FALLBACK_NAV[0];

  // 히어로 티커: API 데이터 우선
  const categoryTicker = buildCategoryTicker(apiCategories);

  // API 데이터 또는 폴백 데이터
  const categories: HomeCategory[] = homeSummary?.categories?.length
    ? homeSummary.categories
    : FALLBACK_HOME_CATEGORIES.map(c => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        description: c.description,
        color: c.color,
        top_items: c.topItems.map(item => ({
          name: item.name,
          slug: item.name.toLowerCase().replace(/\s+/g, '-'),
          tier: item.tier,
          score: item.score,
          brand_name: '',
          brand_slug: '',
          image_url: '',
          usage: 'usage' in item ? (item.usage as string) : '',
        })),
        trending: c.trending,
      }));

  const disputes: HomeDispute[] = homeSummary?.disputes?.length
    ? homeSummary.disputes
    : ALL_HOT_DISPUTES.map(d => ({
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
        reason: d.topComment?.comment || '',
        days_left: d.daysLeft,
      }));

  // 리뷰 데이터 - /posts/ API에서 직접 가져온 데이터 사용
  const reviewPosts: PostListItem[] = postsData?.results || [];

  const userCharts: HomeUserChart[] = homeSummary?.user_charts?.length
    ? homeSummary.user_charts
    : [
        { slug: 'ramen-tier', title: '라면 계급도', author: '라면러버', likes: 128, views: 1420, items: 14 },
        { slug: 'coffee-franchise-tier', title: '커피 프랜차이즈 순위', author: '카페인중독', likes: 95, views: 890, items: 11 },
        { slug: 'delivery-app-tier', title: '배달앱 순위', author: '야식킹', likes: 67, views: 654, items: 8 },
        { slug: 'convenience-store-dosirak-tier', title: '편의점 도시락 티어', author: '혼밥러', likes: 54, views: 432, items: 9 },
      ];

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

          {/* 카테고리 티커 — API에서 활성 카테고리 자동 표시 */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-6">
            {categoryTicker.map((cat) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* 공식 계급도 카드 그리드 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">공식 계급도</h2>
              <p className="text-sm text-muted-foreground">전문가 리뷰 기반 공식 등급</p>
            </div>
          </div>
        </div>

        {/* 카테고리 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(categoryCards.length > 0 ? categoryCards : FALLBACK_HOME_CATEGORIES.map((c, i) => ({
            id: i,
            name: c.name,
            slug: c.slug,
            icon: c.icon,
            group: '' as CategoryGroup,
            description: c.description,
            display_config: { color: c.color },
            display_order: i,
            product_count: undefined,
            brand_count: undefined,
          }))).map((category) => {
            const color = category.display_config?.color || '#3B82F6';
            return (
              <Link key={category.slug} href={`/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    {/* 상단 컬러 바 */}
                    <div
                      className="h-1.5"
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
                    />
                    <div className="p-4">
                      {/* 아이콘 + 이름 */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: `${color}15` }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 통계 - 유효한 데이터만 표시 */}
                      {(category.product_count !== undefined && category.product_count > 0) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span>{category.product_count}개 제품</span>
                          {category.brand_count !== undefined && category.brand_count > 0 && (
                            <>
                              <span className="text-muted">·</span>
                              <span>{category.brand_count}개 브랜드</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* 액션 버튼 */}
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 min-w-0"
                          style={{ borderColor: `${color}50`, color }}
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link href={`/${category.slug}/quiz`}>
                            <Sparkles className="h-3 w-3 sm:mr-1 flex-shrink-0" />
                            <span className="hidden sm:inline">진단</span>
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-[10px] sm:text-xs text-white h-7 sm:h-8 px-1.5 sm:px-3 min-w-0"
                          style={{ background: color }}
                        >
                          계급도
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 🔥 HOT 오픈 계급도 섹션 */}
      <HotOpenTierCharts />

      {/* 내가 만든 계급도 섹션 */}
      <section className="py-8 bg-gradient-to-r from-accent/5 to-primary/5 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">내가 만든 계급도</h2>
            </div>
            <p className="text-muted-foreground">사용자들이 만든 다양한 계급도를 둘러보세요</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/open">
                전체 보기
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button className="bg-accent hover:bg-accent/90" asChild>
              <Link href="/open/create">
                <Plus className="h-4 w-4 mr-1" />
                계급도 만들기
              </Link>
            </Button>
          </div>
        </div>

        {/* 인기 계급도 미리보기 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userCharts.map((chart, index) => (
            <Link key={index} href={`/open/${chart.slug}`}>
              <Card className="card-base h-full hover:border-accent/50 transition-all hover:shadow-lg group cursor-pointer">
                <CardContent className="p-4">
                  {/* 티어 미니 프리뷰 */}
                  <div className="h-3 flex rounded-t overflow-hidden mb-3">
                    {['S', 'A', 'B', 'C', 'D'].map((tier) => (
                      <div
                        key={tier}
                        className="flex-1"
                        style={{
                          background: tier === 'S' ? 'linear-gradient(135deg, #F59E0B, #FCD34D)'
                            : tier === 'A' ? 'linear-gradient(135deg, #10B981, #6EE7B7)'
                            : tier === 'B' ? 'linear-gradient(135deg, #3B82F6, #93C5FD)'
                            : tier === 'C' ? 'linear-gradient(135deg, #94A3B8, #CBD5E1)'
                            : 'linear-gradient(135deg, #F87171, #FCA5A5)'
                        }}
                      />
                    ))}
                  </div>

                  <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors line-clamp-1">
                    {chart.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">{chart.author}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {chart.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {chart.views}
                    </span>
                    <span className="text-[10px]">{chart.items}개</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 이번 주 HOT 이의 - 추후 API 연동 시 활성화 예정 */}

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
                <Link href={`/${defaultCategory.slug}/board?tag=product_review&write=true`}>리뷰 작성하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 그리드 */}
        {reviewPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {reviewPosts.map((post) => {
                // 카테고리 아이콘 찾기
                const categoryInfo = navCategories.find((c) => c.slug === post.category_slug);
                const categoryIcon = categoryInfo?.icon || '📦';

                // 티어 배경색
                const getTierBgColor = (tier: string) => {
                  switch (tier) {
                    case 'S': return 'rgb(255, 215, 0)';
                    case 'A': return TIER_CONFIG.A.color;
                    case 'B': return TIER_CONFIG.B.color;
                    case 'C': return TIER_CONFIG.C.color;
                    case 'D': return TIER_CONFIG.D.color;
                    default: return TIER_CONFIG.C.color;
                  }
                };

                return (
                  <Link key={post.id} href={`/${post.category_slug}/board/${post.id}`}>
                    <Card className="card-base hover:border-accent/50 transition-colors h-full">
                      <CardContent className="p-4">
                        {/* 헤더 */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{categoryIcon}</span>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {post.user.username?.[0] || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{post.user.username}</p>
                              {post.user.badge && post.user.badge !== 'none' && (
                                <p className="text-[10px] text-muted-foreground">{post.user.badge}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: false, locale: ko })}
                          </span>
                        </div>

                        {/* 제품 정보 (있는 경우에만 표시) */}
                        {post.product_info && post.product_info.name && (
                          <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
                            <span>{post.product_info.brand_name} {post.product_info.name}</span>
                            {post.product_info.tier && (
                              <span
                                className={`inline-flex items-center justify-center rounded-lg font-bold shadow-sm min-w-[24px] h-6 px-1.5 text-xs ${
                                  post.product_info.tier === 'S' ? 'text-black animate-pulse' : 'text-white'
                                }`}
                                style={{ background: getTierBgColor(post.product_info.tier) }}
                              >
                                {post.product_info.tier}
                              </span>
                            )}
                          </div>
                        )}

                        {/* 별점 (rating이 있는 경우에만 표시) */}
                        {post.rating && post.rating > 0 && (
                          <div className="mb-2">
                            <StarRating rating={post.rating} />
                          </div>
                        )}

                        {/* 내용 미리보기 */}
                        <p className="text-sm text-foreground/90 mb-3 line-clamp-2">
                          {post.content_preview}
                        </p>

                        {/* 액션 */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>{post.like_count}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{post.comment_count}</span>
                          </span>
                        </div>
                    </CardContent>
                  </Card>
                </Link>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <Link href="/community/reviews" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                더 많은 리뷰 보기 →
              </Link>
            </div>
          </>
        ) : (
          <Card className="card-base">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요!
              </p>
              <Button asChild>
                <Link href={`/${defaultCategory.slug}/board?write=true`}>
                  글 작성하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

    </div>
  );
}
