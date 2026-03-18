'use client';

import { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useBrands, useCategory } from '@/hooks/useBrands';
import { useCategoryProducts } from '@/hooks/useModels';
import { usePosts } from '@/hooks/usePosts';
import type { Brand, Category, Product } from '@/types/model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import { ShareButtons } from '@/components/share/ShareButtons';
import { TIER_CONFIG } from '@/lib/tier';
import type { TierLevel } from '@/lib/tier';
import {
  ArrowRight,
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
  Download,
} from 'lucide-react';

interface CategoryLandingContentProps {
  category: string;
  initialBrands?: Brand[];
  initialCategory?: Category;
}

// 기본 설정 (API에서 데이터가 없을 경우 폴백)
const DEFAULT_COLOR = '#3B82F6';
const DEFAULT_STATS = {
  modelCount: '0',
  reviewCount: '0',
  brandCount: '0',
};

// 항상 stats를 포함하는 설정 타입
interface ResolvedCategoryConfig {
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
}

// 카테고리 데이터에서 설정 추출하는 헬퍼 함수
function getCategoryConfig(categoryData: Category | undefined): ResolvedCategoryConfig {
  if (!categoryData) {
    return {
      name: '제품',
      icon: '📦',
      color: DEFAULT_COLOR,
      heroTitle: '계급도',
      heroDescription: '한눈에 비교하세요',
      heroSubDescription: '커뮤니티 리뷰를 바탕으로 티어로 분류된 순위표',
      itemLabel: '제품',
      quizCTA: '나에게 맞는 제품 찾기',
      stats: DEFAULT_STATS,
    };
  }

  const config = categoryData.display_config || {};

  return {
    name: categoryData.name,
    icon: categoryData.icon || '📦',
    color: config.color || DEFAULT_COLOR,
    heroTitle: config.heroTitle || `${categoryData.name} 계급도`,
    heroDescription: config.heroDescription || '한눈에 비교하세요',
    heroSubDescription: config.heroSubDescription || `커뮤니티 리뷰를 바탕으로 티어로 분류된 ${categoryData.name} 순위표`,
    itemLabel: config.itemLabel || categoryData.name,
    quizCTA: config.quizCTA || `나에게 맞는 ${categoryData.name} 찾기`,
    stats: {
      modelCount: config.stats?.modelCount || String(categoryData.product_count || 0),
      reviewCount: config.stats?.reviewCount || '0',
      brandCount: config.stats?.brandCount || String(categoryData.brand_count || 0),
    },
  };
}

// filter_definitions에서 용도별 탭 데이터 추출 (product_type 필드 사용)
function getUsageCategories(categoryData: Category | undefined) {
  // product_type 필드에서 데이터를 가져옴 (백엔드와 일치)
  if (!categoryData?.filter_definitions?.product_type) {
    return [];
  }

  return categoryData.filter_definitions.product_type.map((pt) => ({
    key: pt.value,
    label: pt.label,
    description: pt.description || '',
    icon: pt.icon || '',
  }));
}

// Mock 트렌딩 데이터
const TRENDING_DATA: Record<string, { name: string; brand: string; tier: TierLevel; change: string; slug: string }[]> = {
  'running-shoes': [
    { name: '노바블라스트 5', brand: '아식스', tier: 'S', change: '+18.5', slug: 'novablast-5' },
    { name: '메타스피드 스카이 도쿄', brand: '아식스', tier: 'S', change: '+15.2', slug: 'metaspeed-sky-tokyo' },
    { name: '클리프톤 10', brand: '호카', tier: 'S', change: '+12.3', slug: 'clifton-10' },
    { name: '엔돌핀 스피드 5', brand: '써코니', tier: 'S', change: '+10.8', slug: 'endorphin-speed-5' },
    { name: '본디 9', brand: '호카', tier: 'S', change: '+9.5', slug: 'bondi-9' },
    { name: '패스트-R 3', brand: '푸마', tier: 'S', change: '+8.7', slug: 'fast-r-3' },
    { name: '아라히 8', brand: '호카', tier: 'S', change: '+7.2', slug: 'arahi-8' },
  ],
  'chicken': [
    { name: '뿌링클', brand: 'BHC', tier: 'S', change: '+18.2', slug: 'bhc-puringkle' },
    { name: '황금올리브치킨', brand: 'BBQ', tier: 'S', change: '+12.0', slug: 'bbq-golden-olive' },
    { name: '교촌 레드', brand: '교촌', tier: 'A', change: '+9.5', slug: 'kyochon-red' },
    { name: '굽네 고추바사삭', brand: '굽네', tier: 'A', change: '+6.3', slug: 'goobne-gochu' },
    { name: '네네 스노윙', brand: '네네', tier: 'B', change: '+4.1', slug: 'nene-snowing' },
  ],
  'mens-watch': [
    { name: '노틸러스 5711/1A', brand: '파텍 필립', tier: 'S', change: '+22.3', slug: 'patek-nautilus-5711-1a' },
    { name: '로열오크 15500ST', brand: '오데마 피게', tier: 'S', change: '+15.8', slug: 'ap-royal-oak-15500st' },
    { name: '스피드마스터 문워치', brand: '오메가', tier: 'S', change: '+12.1', slug: 'omega-speedmaster-moonwatch-pro' },
    { name: '서브마리너 데이트', brand: '롤렉스', tier: 'S', change: '+9.7', slug: 'rolex-submariner-date' },
    { name: '블랙베이 58', brand: '튜더', tier: 'A', change: '+8.4', slug: 'tudor-black-bay-58' },
    { name: '스노우플레이크', brand: '그랜드 세이코', tier: 'A', change: '+7.2', slug: 'grand-seiko-snowflake' },
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
  'mens-watch': [
    {
      productId: 301,
      productName: '그랜드 세이코',
      productSlug: 'grand-seiko',
      brandName: '그랜드 세이코',
      currentTier: 'B',
      upVotes: 89,
      downVotes: 15,
      totalVotes: 104,
      topComment: {
        id: 5,
        userName: '시계덕후',
        voteType: 'up',
        comment: '스프링 드라이브 기술력은 스위스도 못 따라옵니다. A티어 가치 충분!',
        createdAt: '2시간 전',
        likes: 28,
      },
      daysLeft: 3,
    },
    {
      productId: 302,
      productName: '튜더',
      productSlug: 'tudor',
      brandName: '튜더',
      currentTier: 'C',
      upVotes: 67,
      downVotes: 45,
      totalVotes: 112,
      topComment: {
        id: 6,
        userName: '워치컬렉터',
        voteType: 'up',
        comment: '롤렉스 무브먼트 기반에 가격은 절반, B티어는 되어야죠.',
        createdAt: '4시간 전',
        likes: 19,
      },
      daysLeft: 5,
    },
  ],
};

// 리뷰 데이터는 API에서 가져옵니다 (usePosts 훅 → product_review 태그)

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

export function CategoryLandingContent({ category, initialBrands, initialCategory }: CategoryLandingContentProps) {
  const { data: brands = initialBrands, isLoading } = useBrands(category, initialBrands);
  const { data: categoryData = initialCategory } = useCategory(category, initialCategory);
  const { data: products = [], isLoading: isProductsLoading } = useCategoryProducts(category);
  const tierGridRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // API 데이터 기반으로 설정 추출
  const config = useMemo(() => getCategoryConfig(categoryData), [categoryData]);
  const usageCategories = useMemo(() => getUsageCategories(categoryData), [categoryData]);

  // 제품을 product_type과 tier별로 그룹화 (TierPageContent와 동일한 로직)
  const usageTierData = useMemo(() => {
    const grouped: Record<string, Partial<Record<TierLevel, Product[]>>> = {};

    for (const product of products) {
      const productType = product.product_type || 'other';
      const tier = product.tier as TierLevel;

      if (!grouped[productType]) {
        grouped[productType] = {};
      }
      if (!grouped[productType][tier]) {
        grouped[productType][tier] = [];
      }

      grouped[productType][tier]!.push(product);
    }

    // 각 티어 내에서 점수순 정렬
    for (const productType in grouped) {
      for (const tier in grouped[productType]) {
        grouped[productType][tier as TierLevel]?.sort((a, b) => b.tier_score - a.tier_score);
      }
    }

    return grouped;
  }, [products]);

  // Mock 데이터 (trending/disputes는 아직 API 없음)
  const trending = TRENDING_DATA[category] || [];
  const disputes = DISPUTE_DATA[category] || [];

  // API에서 실제 리뷰를 가져옴
  const { data: postsData } = usePosts({ category, tag: 'product_review', page_size: 4 });
  const reviews = useMemo(() => {
    const posts = postsData?.results || [];
    return posts.map((post) => ({
      id: post.id,
      user: {
        name: post.user?.username || '사용자',
        footType: '',
      },
      model: {
        name: post.product_info?.name || '',
        brand: post.product_info?.brand_name || '',
        tier: (post.product_info?.tier || 'B') as TierLevel,
        slug: post.product_info?.slug || '',
      },
      rating: post.rating || 4,
      content: (post.content_preview || '').slice(0, 100),
      likes: post.like_count || 0,
      comments: post.comment_count || 0,
      createdAt: new Date(post.created_at).toLocaleDateString('ko-KR'),
    }));
  }, [postsData]);

  const handleDownloadImage = async () => {
    if (!tierGridRef.current) {
      toast.error('캡처할 영역을 찾을 수 없습니다.');
      return;
    }

    setIsDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(tierGridRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipFonts: true,
      });

      const link = document.createElement('a');
      link.download = `계급도_${category}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('이미지가 다운로드되었습니다.');
    } catch {
      toast.error('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading || isProductsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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

          </div>
        </div>
      </section>

      {/* 관심 상승 TOP 5 - 향후 활용 예정으로 숨김 처리 */}
      {/* <section className="max-w-5xl mx-auto">
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
      </section> */}

      {/* 계급도 메인 섹션 */}
      <section className="max-w-5xl mx-auto">
        {/* Header with Download Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {config.name} 계급도
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              커뮤니티 리뷰와 {brands?.length || 0}개 브랜드 데이터 기반
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadImage} disabled={isDownloading}>
              {isDownloading ? (
                <span className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isDownloading ? '생성 중...' : '이미지 저장'}
            </Button>
            <ShareButtons
              title={`${config.name} 계급도 - 계급도`}
              description={`커뮤니티 리뷰 기반 ${config.name} 티어 순위표`}
              variant="compact"
            />
          </div>
        </div>

        {/* 용도별 계급도 (브랜드 계급도 탭 제거됨) */}
        <div ref={tierGridRef} className="space-y-8">
          {usageCategories.map((usage) => {
            const usageTiers = usageTierData[usage.key] || {};
            const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

            return (
              <Card key={usage.key} className="card-base overflow-hidden">
                {/* 용도 헤더 */}
                <div className="bg-gradient-to-r from-accent/10 to-primary/5 px-5 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl">
                      {usage.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{usage.label}</h3>
                      <p className="text-sm text-muted-foreground">{usage.description}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-0">
                  {/* TierMaker 스타일 티어 행 */}
                  {tiers.map((tier) => {
                    const items = usageTiers[tier] || [];
                    const tierConfig = TIER_CONFIG[tier];

                    return (
                      <div key={tier} className="flex border-b last:border-b-0">
                        {/* 티어 라벨 */}
                        <div
                          className="w-16 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: tierConfig.color }}
                        >
                          <span className={`text-lg font-black ${tier === 'S' ? 'text-black' : 'text-white'}`}>
                            {tierConfig.label}
                          </span>
                        </div>

                        {/* 제품 목록 */}
                        <div className="flex-1 p-2 bg-muted/30 flex flex-wrap gap-1.5 min-h-[60px] items-center">
                          {items.length === 0 ? (
                            <span className="text-sm text-muted-foreground italic">-</span>
                          ) : (
                            items.map((product) => (
                              <Link
                                key={product.slug}
                                href={`/${category}/model/${product.slug}`}
                                className="group"
                              >
                                <div className="bg-card border rounded-lg px-3 py-2 hover:border-accent hover:shadow-md transition-all">
                                  <p className="text-[10px] text-muted-foreground">
                                    {product.brand?.name || ''}
                                  </p>
                                  <p className="font-medium text-sm group-hover:text-accent transition-colors line-clamp-1">
                                    {product.name}
                                  </p>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interactive Features CTAs */}
      <section className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Quiz CTA */}
          <Card className="card-base border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 hover:border-accent/50 transition-all">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl mb-3">
                🎯
              </div>
              <h3 className="font-bold mb-1">
                {config.quizCTA}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                3분 퀴즈로 취향에 맞는 제품을 찾아보세요
              </p>
              <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                <Link href={`/${category}/quiz`}>퀴즈 시작 <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Discover CTA */}
          <Card className="card-base border-pink-300/30 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/10 hover:border-pink-400/50 transition-all">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl mb-3">
                💖
              </div>
              <h3 className="font-bold mb-1">스와이프로 발견하기</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                좌우 스와이프로 취향에 맞는 제품을 찾아보세요
              </p>
              <Button variant="outline" className="w-full border-pink-300 hover:bg-pink-50" asChild>
                <Link href={`/${category}/discover`}>시작하기 <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
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
            <Link href={`/${category}/tier`}>
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
              <Link href={`/${category}/board?tag=product_review`}>전체 리뷰 보기</Link>
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
                  <Link href={`/${category}/board?tag=product_review&write=true`}>
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
              href={`/${category}/board?tag=product_review`}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              더 많은 리뷰 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 퀵 메뉴 */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
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
