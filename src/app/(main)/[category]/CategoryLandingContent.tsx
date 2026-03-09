'use client';

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import { useBrands, useCategory } from '@/hooks/useBrands';
import type { Brand, Category, CategoryDisplayConfig } from '@/types/model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TierBadge } from '@/components/tier/TierBadge';
import { TierGrid } from '@/components/tier/TierGrid';
import { UsageTierSection } from '@/components/tier/UsageTierSection';
import { ShareButtons } from '@/components/share/ShareButtons';
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

// filter_definitions에서 usage 탭 데이터 추출
function getUsageCategories(categoryData: Category | undefined) {
  if (!categoryData?.filter_definitions?.usage) {
    return [];
  }

  return categoryData.filter_definitions.usage.map((usage) => ({
    key: usage.value,
    label: usage.label,
    description: usage.description || '',
    icon: usage.icon || '',
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
  'mens-watch': [
    {
      id: 301,
      user: { name: '시계입문자', footType: '첫 명품시계' },
      model: { name: '오메가 스피드마스터', brand: '오메가', tier: 'B', slug: 'omega' },
      rating: 5,
      content: '달에 간 시계라는 스토리가 매력적이에요. 디자인도 클래식하고 어디에나 잘 어울립니다.',
      likes: 45,
      comments: 12,
      createdAt: '1시간 전',
    },
    {
      id: 302,
      user: { name: '워치매니아', footType: '컬렉터' },
      model: { name: '롤렉스 서브마리너', brand: '롤렉스', tier: 'A', slug: 'rolex' },
      rating: 5,
      content: '결국 돌고 돌아 롤렉스입니다. 환금성도 최고, 내구성도 최고. 시계질의 끝.',
      likes: 67,
      comments: 18,
      createdAt: '3시간 전',
    },
    {
      id: 303,
      user: { name: '직장인K', footType: '사회초년생' },
      model: { name: '튜더 블랙베이', brand: '튜더', tier: 'C', slug: 'tudor' },
      rating: 4,
      content: '롤렉스의 동생답게 품질이 좋습니다. 가격 대비 만족도가 높아요.',
      likes: 38,
      comments: 8,
      createdAt: '5시간 전',
    },
    {
      id: 304,
      user: { name: '가성비왕', footType: '입문자' },
      model: { name: '티쏘 PRX', brand: '티쏘', tier: 'D', slug: 'tissot' },
      rating: 5,
      content: '50만원대에 이 정도 디자인이면 국밥급이죠. 출근용으로 완벽합니다.',
      likes: 52,
      comments: 14,
      createdAt: '1일 전',
    },
  ],
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

export function CategoryLandingContent({ category, initialBrands, initialCategory }: CategoryLandingContentProps) {
  const { data: brands = initialBrands, isLoading } = useBrands(category, initialBrands);
  const { data: categoryData = initialCategory } = useCategory(category, initialCategory);
  const tierGridRef = useRef<HTMLDivElement>(null);

  // API 데이터 기반으로 설정 추출
  const config = useMemo(() => getCategoryConfig(categoryData), [categoryData]);
  const usageCategories = useMemo(() => getUsageCategories(categoryData), [categoryData]);

  // Mock 데이터 (추후 API 연동 필요)
  const trending = TRENDING_DATA[category] || [];
  const disputes = DISPUTE_DATA[category] || [];
  const reviews = REVIEW_DATA[category] || [];

  const handleDownloadImage = async () => {
    if (!tierGridRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tierGridRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      // Add watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '16px Pretendard, sans-serif';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.textAlign = 'right';
        ctx.fillText('tier-chart.com', canvas.width - 20, canvas.height - 20);

        const now = new Date();
        const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
        ctx.fillText(dateStr, canvas.width - 20, canvas.height - 44);
      }

      const link = document.createElement('a');
      link.download = `계급도_${category}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      // html2canvas not available
    }
  };

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
            <Button variant="outline" size="sm" onClick={handleDownloadImage}>
              <Download className="h-4 w-4 mr-2" />
              이미지 저장
            </Button>
            <ShareButtons
              title={`${config.name} 계급도 - 계급도`}
              description={`커뮤니티 리뷰 기반 ${config.name} 티어 순위표`}
              variant="compact"
            />
          </div>
        </div>

        {/* View Tabs */}
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2 h-14 p-1 bg-muted/80 rounded-xl">
            <TabsTrigger
              value="usage"
              className="h-full text-base font-semibold rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              🎯 용도별 계급도
            </TabsTrigger>
            <TabsTrigger
              value="brand"
              className="h-full text-base font-semibold rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              🏆 브랜드 계급도
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <div className="space-y-8">
              {usageCategories.map((usage) => (
                <UsageTierSection
                  key={usage.key}
                  category={category}
                  usage={usage}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="brand">
            <div ref={tierGridRef} className="bg-card p-4 rounded-2xl">
              {brands && <TierGrid brands={brands} category={category} />}
            </div>
          </TabsContent>
        </Tabs>
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
