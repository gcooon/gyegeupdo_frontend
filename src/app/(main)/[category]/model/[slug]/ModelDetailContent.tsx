'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useProduct } from '@/hooks/useModels';
import { useAuth } from '@/hooks/useAuth';
import { useProductDispute, useCreateDispute, useDisputeVote } from '@/hooks/useDisputes';
import { TierBadge } from '@/components/tier/TierBadge';
import { RadarChartSection } from '@/components/model/RadarChartSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCategoryInfo } from '@/config/categories';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  ShoppingCart,
  ExternalLink,
  AlertTriangle,
  Users,
  RotateCcw,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Star,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  Share2,
  Heart,
  Bookmark,
  Info,
  Package,
  Ruler,
  Zap,
  Shield,
  Award,
  MessageCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { TierLevel } from '@/lib/tier';
import { ShareButtons } from '@/components/share/ShareButtons';
import { ProductBoardSection } from '@/components/board/ProductBoardSection';

// 이미지 표시 여부 플래그 (이미지 준비 완료 시 true로 변경)
const SHOW_PRODUCT_IMAGES = false;

interface Props {
  category: string;
  slug: string;
  initialProduct?: import('@/types/model').ProductDetail;
}

// 리뷰 출처 타입
type ReviewSource = 'internal' | 'external';

// 카테고리별 Mock 제품 상세 데이터
const MOCK_PRODUCT_DETAILS: Record<string, Record<string, {
  highlights: string[];
  pros: string[];
  cons: string[];
  features: { icon: string; label: string; value: string }[];
  reviews: {
    id: number;
    user: string;
    userType: string;
    rating: number;
    content: string;
    pros: string[];
    cons: string[];
    likes: number;
    dislikes: number;
    verified: boolean;
    createdAt: string;
    source: ReviewSource;
  }[];
  faq: { question: string; answer: string }[];
  upVotes: number;
  downVotes: number;
  viewCount: number;
  reviewCount: number;
}>> = {
  'running-shoes': {
    'novablast-4': {
      highlights: ['FF BLAST PLUS 미드솔', '트램폴린 같은 반발력', '데일리 트레이닝 최적화'],
      pros: ['뛰어난 쿠셔닝과 반발력', '가벼운 무게', '세련된 디자인', '통기성 우수'],
      cons: ['넓은 발볼 사이즈 부족', '젖은 노면에서 미끄러움', '가격이 다소 높음'],
      features: [
        { icon: '⚖️', label: '무게', value: '258g (남성 270mm)' },
        { icon: '📏', label: '스택 높이', value: '41mm / 33mm' },
        { icon: '↕️', label: '드롭', value: '8mm' },
        { icon: '🧬', label: '미드솔', value: 'FF BLAST PLUS' },
        { icon: '👟', label: '어퍼', value: '엔지니어드 메쉬' },
        { icon: '🏃', label: '용도', value: '데일리 러닝, 장거리' },
      ],
      reviews: [
        {
          id: 1,
          user: '러닝매니아',
          userType: '평발 / 넓은 발 / 주 50km',
          rating: 5,
          content: '노바블라스트 3에서 업그레이드했는데 확실히 쿠셔닝이 더 좋아졌어요. 10km 이상 달려도 발이 편하고, 반발력도 적당해서 페이스 유지하기 좋습니다. 디자인도 예뻐서 일상화로도 신어요.',
          pros: ['쿠셔닝', '반발력', '디자인'],
          cons: ['넓은 발볼 사이즈'],
          likes: 47,
          dislikes: 3,
          verified: true,
          createdAt: '2일 전',
          source: 'internal',
        },
        {
          id: 2,
          user: '마라토너K',
          userType: '정상 / 보통 발 / 주 80km',
          rating: 4,
          content: '풀마라톤 훈련용으로 사용 중입니다. 장거리에서도 발이 덜 피로하고 편안해요. 다만 스피드 훈련에는 좀 무거운 느낌이 있어서 별도 레이싱화를 사용합니다.',
          pros: ['장거리 편안함', '내구성'],
          cons: ['무게감', '속도감 부족'],
          likes: 32,
          dislikes: 5,
          verified: true,
          createdAt: '1주일 전',
          source: 'external',
                  },
        {
          id: 3,
          user: '초보러너',
          userType: '요족 / 좁은 발 / 주 20km',
          rating: 5,
          content: '러닝 입문자인데 이 신발로 시작하길 정말 잘했어요! 무릎에 무리가 안 가고 달리는 게 재밌어졌습니다. 가격이 좀 있지만 투자할 가치 있어요.',
          pros: ['입문자 친화적', '무릎 보호'],
          cons: ['가격'],
          likes: 28,
          dislikes: 2,
          verified: true,
          createdAt: '2주일 전',
          source: 'external',
                  },
      ],
      faq: [
        { question: '사이즈는 정사이즈로 신으면 되나요?', answer: '일반적으로 정사이즈 또는 5mm 업하는 것을 권장합니다. 넓은 발볼이신 분은 반 사이즈 업을 추천드려요.' },
        { question: '비 오는 날에도 괜찮나요?', answer: '어퍼가 메쉬 소재라 비 오는 날 물이 스며들 수 있습니다. 아웃솔 그립도 젖은 노면에서는 주의가 필요해요.' },
        { question: '노바블라스트 3과 차이점이 뭔가요?', answer: '4세대는 미드솔이 더 두꺼워지고 쿠셔닝이 향상되었습니다. 전체적으로 더 부드럽고 반발력도 개선되었어요.' },
      ],
      upVotes: 245,
      downVotes: 18,
      viewCount: 15420,
      reviewCount: 89,
    },
    'alphafly-3': {
      highlights: ['줌X 스트로벨 + 에어줌 유닛', '풀렝스 카본 플레이트', '마라톤 세계신기록 달성화'],
      pros: ['최고의 에너지 리턴', '레이스용 최적화', '가벼운 무게'],
      cons: ['가격이 매우 비쌈', '내구성 이슈', '일상 러닝엔 과함'],
      features: [
        { icon: '⚖️', label: '무게', value: '215g (남성 270mm)' },
        { icon: '📏', label: '스택 높이', value: '40mm / 36mm' },
        { icon: '↕️', label: '드롭', value: '4mm' },
        { icon: '🧬', label: '미드솔', value: 'ZoomX + Carbon Plate' },
        { icon: '👟', label: '어퍼', value: 'AtomKnit 3.0' },
        { icon: '🏃', label: '용도', value: '마라톤, 하프마라톤' },
      ],
      reviews: [
        {
          id: 1,
          user: '서브3러너',
          userType: '정상 / 보통 발 / 풀마라톤 2:52',
          rating: 5,
          content: '가격이 아깝지 않습니다. 대회에서 3분이나 기록을 단축했어요. 반발력이 정말 미쳤습니다. 다만 훈련용으로 쓰기엔 아깝고, 대회 전용으로 아껴 신고 있습니다.',
          pros: ['압도적 반발력', '기록 단축'],
          cons: ['가격', '내구성'],
          likes: 89,
          dislikes: 4,
          verified: true,
          createdAt: '3일 전',
          source: 'external',
                  },
      ],
      faq: [
        { question: '일반 러닝에도 괜찮을까요?', answer: '기능적으로는 가능하지만, 레이싱용으로 최적화되어 있어 내구성이 낮고 가격이 비싸 추천하지 않습니다.' },
        { question: '얼마나 오래 신을 수 있나요?', answer: '일반적으로 300-400km 정도가 수명입니다. 레이스 전용으로 아껴 신으시는 것을 권장합니다.' },
      ],
      upVotes: 156,
      downVotes: 12,
      viewCount: 28450,
      reviewCount: 156,
    },
  },
  'chicken': {
    'bhc-puringkle': {
      highlights: ['BHC 10년 연속 1위 메뉴', '특제 치즈 시즈닝', 'MZ세대 최애 치킨'],
      pros: ['중독성 있는 치즈맛', '바삭한 튀김옷', '아이들도 좋아함', '재주문율 높음'],
      cons: ['양이 조금 아쉬움', '느끼할 수 있음', '치즈가 눅눅해질 수 있음'],
      features: [
        { icon: '🍗', label: '조리방식', value: '튀김' },
        { icon: '💰', label: '가격', value: '19,000원 (한 마리)' },
        { icon: '📦', label: '구성', value: '치킨 + 무 + 소스' },
        { icon: '🌶️', label: '맵기', value: '없음 (순한맛)' },
        { icon: '⏱️', label: '조리시간', value: '약 25분' },
        { icon: '🥤', label: '추천 음료', value: '맥주, 콜라' },
      ],
      reviews: [
        {
          id: 1,
          user: '치킨마스터',
          userType: '매운맛 선호 / 치맥 마니아',
          rating: 5,
          content: '진짜 계속 생각나는 맛이에요. 치즈 시즈닝이 짭짤하면서 고소해서 맥주랑 찰떡입니다. 바삭함도 오래 유지되는 편이에요. 다만 양이 조금 아쉬워서 콤보로 시키는 게 좋아요.',
          pros: ['중독성', '맥주 안주'],
          cons: ['양'],
          likes: 156,
          dislikes: 8,
          verified: true,
          createdAt: '1일 전',
          source: 'internal',
        },
        {
          id: 2,
          user: '혼닭러버',
          userType: '담백한 맛 선호 / 혼밥족',
          rating: 4,
          content: '혼자 먹기에 딱 좋은 양이고, 배달도 빠른 편이에요. 근데 좀 느끼할 수 있어서 콜라는 필수! 개인적으로 뿌링핫도 추천합니다.',
          pros: ['1인분 적합', '빠른 배달'],
          cons: ['느끼함'],
          likes: 89,
          dislikes: 12,
          verified: true,
          createdAt: '3일 전',
          source: 'external',
                  },
      ],
      faq: [
        { question: '뿌링클과 뿌링핫의 차이는?', answer: '뿌링클은 치즈 시즈닝의 고소한 맛, 뿌링핫은 매콤한 시즈닝이 추가된 버전입니다.' },
        { question: '콤보로 시키면 어떤 구성인가요?', answer: '뿌링클 반 + 순살 반 구성으로, 가격은 22,000원입니다.' },
        { question: '배달 시간은 얼마나 걸리나요?', answer: '평균 30-40분 정도 소요되며, 피크타임에는 1시간 이상 걸릴 수 있습니다.' },
      ],
      upVotes: 612,
      downVotes: 22,
      viewCount: 45230,
      reviewCount: 342,
    },
    'bbq-golden-olive': {
      highlights: ['스페인산 올리브유 사용', 'BBQ 시그니처 메뉴', '담백하고 바삭한 기본기'],
      pros: ['담백한 맛', '바삭한 튀김옷', '올리브유로 덜 느끼함', '치킨 본연의 맛'],
      cons: ['특별한 맛은 없음', '가격대비 양'],
      features: [
        { icon: '🍗', label: '조리방식', value: '튀김 (올리브유)' },
        { icon: '💰', label: '가격', value: '20,000원 (한 마리)' },
        { icon: '📦', label: '구성', value: '치킨 + 무 + 콜라' },
        { icon: '🌶️', label: '맵기', value: '없음' },
        { icon: '⏱️', label: '조리시간', value: '약 25분' },
        { icon: '🥤', label: '추천 음료', value: '맥주, 하이볼' },
      ],
      reviews: [
        {
          id: 1,
          user: '치킨평론가',
          userType: '담백한 맛 선호',
          rating: 5,
          content: '후라이드 치킨의 정석입니다. 올리브유로 튀겨서 느끼하지 않고, 치킨 살 자체의 맛이 살아있어요. 양념 치킨에 질렸을 때 먹으면 최고!',
          pros: ['담백함', '바삭함'],
          cons: ['평범할 수 있음'],
          likes: 234,
          dislikes: 15,
          verified: true,
          createdAt: '5시간 전',
          source: 'external',
                  },
      ],
      faq: [
        { question: '정말 올리브유로 튀기나요?', answer: '네, 스페인산 엑스트라 버진 올리브유를 사용합니다.' },
        { question: '반반치킨으로 시킬 수 있나요?', answer: '네, 황금올리브 반 + 양념 반으로 주문 가능합니다.' },
      ],
      upVotes: 524,
      downVotes: 28,
      viewCount: 38920,
      reviewCount: 278,
    },
  },
};

// 기본 Mock 데이터
const DEFAULT_PRODUCT_DETAILS = {
  highlights: ['인기 제품', '커뮤니티 추천', '높은 만족도'],
  pros: ['높은 품질', '합리적 가격', '좋은 후기'],
  cons: ['재고 부족 가능', '배송 시간'],
  features: [],
  reviews: [],
  faq: [],
  upVotes: 100,
  downVotes: 10,
  viewCount: 5000,
  reviewCount: 50,
};

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

export function ModelDetailContent({ category, slug, initialProduct }: Props) {
  const { data: product = initialProduct, isLoading, error } = useProduct(slug, initialProduct);
  const { isAuthenticated } = useAuth();
  const { data: activeDispute, refetch: refetchDispute } = useProductDispute(slug);
  const createDispute = useCreateDispute();
  const disputeVote = useDisputeVote();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeType, setDisputeType] = useState<'upgrade' | 'downgrade' | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Mock 상세 데이터 가져오기
  const details = MOCK_PRODUCT_DETAILS[category]?.[slug] || DEFAULT_PRODUCT_DETAILS;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">제품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">제품을 찾을 수 없습니다.</p>
        <Button asChild className="mt-4">
          <Link href={`/${category}/tier`}>계급도로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  // 실제 API 데이터 또는 Mock 데이터 사용
  const disputeUpVotes = activeDispute?.support_count ?? details.upVotes;
  const disputeDownVotes = activeDispute?.oppose_count ?? details.downVotes;
  const totalVotes = disputeUpVotes + disputeDownVotes;
  const upPercent = totalVotes > 0 ? Math.round((disputeUpVotes / totalVotes) * 100) : 50;
  const userVote = activeDispute?.user_vote;

  // 투표 처리
  const handleVote = async (voteType: 'support' | 'oppose') => {
    if (!isAuthenticated) {
      toast.warning('로그인이 필요합니다.');
      return;
    }

    // 이미 투표했으면 무시
    if (userVote) {
      toast.info('이미 투표하셨습니다.');
      return;
    }

    // 활성 이의제기가 없으면 새로 생성
    if (!activeDispute && product) {
      setDisputeType(voteType === 'support' ? 'upgrade' : 'downgrade');
      setShowDisputeDialog(true);
      return;
    }

    // 기존 이의제기에 투표
    if (activeDispute) {
      try {
        await disputeVote.mutateAsync({
          disputeId: activeDispute.id,
          vote: voteType,
        });
        refetchDispute();
        toast.success('투표가 완료되었습니다.');
      } catch {
        toast.error('투표 중 오류가 발생했습니다.');
      }
    }
  };

  // 이의제기 생성
  const handleCreateDispute = async () => {
    if (!disputeType || !disputeReason.trim() || !product) return;

    try {
      await createDispute.mutateAsync({
        product: product.id,
        dispute_type: disputeType,
        reason: disputeReason.trim(),
      });
      setShowDisputeDialog(false);
      setDisputeReason('');
      setDisputeType(null);
      refetchDispute();
      toast.success('이의제기가 등록되었습니다.');
    } catch {
      toast.error('이의제기 생성 중 오류가 발생했습니다.');
    }
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/${category}/tier`} className="hover:text-accent transition-colors">
          {categoryInfo.icon} {categoryInfo.name} 계급도
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/${category}/brand/${product.brand.slug}`}
          className="hover:text-accent transition-colors"
        >
          {product.brand.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image - 이미지 준비 완료 시 SHOW_PRODUCT_IMAGES를 true로 변경 */}
            {SHOW_PRODUCT_IMAGES && (
              <div className="md:w-2/5 shrink-0">
                <Card className="card-base overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={`${product.brand.name} ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-8xl text-muted-foreground/50">
                        {categoryInfo.icon}
                      </span>
                    )}
                    {/* Bookmark Button */}
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
                    >
                      <Bookmark
                        className={`h-5 w-5 ${isBookmarked ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                      />
                    </button>
                  </div>
                </Card>
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1 space-y-4">
              {/* Brand & Name */}
              <div>
                <p className="text-sm text-muted-foreground">{product.brand.name}</p>
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              </div>

              {/* Tier & Score */}
              <div className="flex items-center gap-3">
                <TierBadge tier={product.tier} size="lg" />
                <div>
                  <span className="text-2xl font-bold">{product.tier_score.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">점</span>
                </div>
                {product.trend && (
                  <Badge
                    variant="outline"
                    className={
                      product.trend === 'up'
                        ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
                        : product.trend === 'down'
                          ? 'text-red-600 border-red-500 bg-red-50'
                          : 'text-muted-foreground'
                    }
                  >
                    {product.trend === 'up' ? (
                      <><TrendingUp className="h-3 w-3 mr-1" />상승 중</>
                    ) : product.trend === 'down' ? (
                      <><TrendingDown className="h-3 w-3 mr-1" />하락 중</>
                    ) : '→ 유지'}
                  </Badge>
                )}
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {details.highlights.map((highlight, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-accent/10 text-accent">
                    {highlight}
                  </Badge>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <p className="text-xl font-bold">{details.reviewCount}</p>
                  <p className="text-xs text-muted-foreground">리뷰</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <p className="text-xl font-bold">{(details.viewCount / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">조회수</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <p className="text-xl font-bold">{upPercent}%</p>
                  <p className="text-xs text-muted-foreground">추천율</p>
                </div>
              </div>

              {/* Share & Compare Buttons */}
              <div className="flex gap-2 pt-2">
                <ShareButtons
                  title={`${product.name} - ${product.brand.name} | 티어차트 계급도`}
                  description={`${product.brand.name} ${product.name} ${product.tier}티어 - 커뮤니티 리뷰 기반 평가`}
                  variant="compact"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/${category}/compare?models=${slug}`}>
                    비교하기
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* UP/DOWN Voting Section */}
          <Card className="card-base border-2 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardContent className="py-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold mb-1">
                    {activeDispute ? (
                      <>
                        {activeDispute.dispute_type === 'upgrade' ? '상향' : '하향'} 이의 진행 중
                        <Badge variant="outline" className="ml-2 text-xs">
                          {activeDispute.status === 'colosseum' ? '투표 진행' : '검토 중'}
                        </Badge>
                      </>
                    ) : (
                      '이 제품의 티어가 적절한가요?'
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeDispute
                      ? `"${activeDispute.reason.slice(0, 50)}${activeDispute.reason.length > 50 ? '...' : ''}" - ${activeDispute.user.username}`
                      : '커뮤니티 투표로 등급이 조정됩니다'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote('support')}
                    disabled={!!userVote || disputeVote.isPending}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                      userVote === 'support'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : userVote
                          ? 'border-muted opacity-50 cursor-not-allowed'
                          : 'border-muted hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <ChevronUp className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-bold">{disputeUpVotes}</p>
                      <p className="text-xs">찬성</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleVote('oppose')}
                    disabled={!!userVote || disputeVote.isPending}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                      userVote === 'oppose'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : userVote
                          ? 'border-muted opacity-50 cursor-not-allowed'
                          : 'border-muted hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-bold">{disputeDownVotes}</p>
                      <p className="text-xs">반대</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 로그인 안내 */}
              {!isAuthenticated && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    투표에 참여하려면{' '}
                    <Link href={`/login?redirect=/${category}/model/${slug}`} className="text-accent underline">
                      로그인
                    </Link>
                    이 필요합니다.
                  </AlertDescription>
                </Alert>
              )}

              {/* Vote Progress */}
              <div className="mt-4 space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${upPercent}%` }} />
                  <div className="bg-red-500 transition-all" style={{ width: `${100 - upPercent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>찬성 {upPercent}%</span>
                  <span>총 {totalVotes}명 투표</span>
                  <span>반대 {100 - upPercent}%</span>
                </div>
              </div>

              {/* 투표 상태 메시지 */}
              {userVote && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  이미 {userVote === 'support' ? '찬성' : '반대'}에 투표하셨습니다
                </p>
              )}
            </CardContent>
          </Card>

          {/* 이의제기 생성 다이얼로그 */}
          <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {product?.name} 등급 {disputeType === 'upgrade' ? '상향' : '하향'} 이의제기
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <TierBadge tier={product?.tier || 'B'} size="md" />
                  <span className="text-muted-foreground">→</span>
                  <Badge
                    variant="outline"
                    className={disputeType === 'upgrade'
                      ? 'text-emerald-600 border-emerald-500'
                      : 'text-red-600 border-red-500'
                    }
                  >
                    {disputeType === 'upgrade' ? '상향' : '하향'} 요청
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">이의 사유</label>
                  <Textarea
                    placeholder="등급 조정이 필요한 이유를 입력해주세요..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {disputeReason.length}/500
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    이의제기가 30명 이상의 찬성을 받으면 콜로세움에서 공개 투표가 진행됩니다.
                    관리자가 투표 결과를 검토하여 등급을 조정합니다.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
                  취소
                </Button>
                <Button
                  onClick={handleCreateDispute}
                  disabled={!disputeReason.trim() || createDispute.isPending}
                  className={disputeType === 'upgrade'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'
                  }
                >
                  {createDispute.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />처리 중...</>
                  ) : (
                    '이의제기 등록'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Features / Specs */}
          {details.features.length > 0 && (
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  제품 사양
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {details.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/50 rounded-xl text-center"
                    >
                      <span className="text-2xl mb-2 block">{feature.icon}</span>
                      <p className="text-xs text-muted-foreground">{feature.label}</p>
                      <p className="font-semibold text-sm">{feature.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="card-base border-emerald-200 bg-emerald-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-700 flex items-center gap-2 text-base">
                  <Check className="h-5 w-5" />
                  장점
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {details.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="card-base border-red-200 bg-red-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700 flex items-center gap-2 text-base">
                  <X className="h-5 w-5" />
                  단점
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {details.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <X className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Community Rating Radar Chart */}
          {product.scores && product.scores.length > 0 && (
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  커뮤니티 평가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadarChartSection scores={product.scores} showComparison={false} />
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card className="card-base">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-accent" />
                  사용자 리뷰
                  <Badge variant="secondary">{details.reviews.length}개</Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/${category}/board?tag=product_review&product=${slug}&write=true`}>
                    리뷰 작성하기
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {details.reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>아직 등록된 리뷰가 없습니다.</p>
                  <p className="text-sm mt-1">첫 번째 리뷰를 작성해주세요!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {details.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-muted/30 rounded-xl border border-transparent hover:border-accent/30 transition-colors"
                    >
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">{review.user[0]}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 text-emerald-600 border-emerald-500">
                                  <Check className="h-2.5 w-2.5 mr-0.5" />인증
                                </Badge>
                              )}
                              {/* 리뷰 출처 태그 */}
                              {review.source === 'internal' ? (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/30">
                                  계급도 리뷰
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-600 border-slate-300">
                                  외부 리뷰
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{review.userType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={review.rating} size="sm" />
                          <p className="text-xs text-muted-foreground mt-1">{review.createdAt}</p>
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-sm mb-3">{review.content}</p>

                      {/* Review Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.pros.map((pro, idx) => (
                          <Badge key={idx} variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
                            <Check className="h-3 w-3 mr-1" />{pro}
                          </Badge>
                        ))}
                        {review.cons.map((con, idx) => (
                          <Badge key={idx} variant="outline" className="text-red-600 border-red-300 bg-red-50">
                            <X className="h-3 w-3 mr-1" />{con}
                          </Badge>
                        ))}
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-accent transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span>도움돼요 {review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* More Reviews Button */}
                  <Button variant="outline" className="w-full">
                    더 많은 리뷰 보기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* FAQ Section */}
          {details.faq.length > 0 && (
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-accent" />
                  자주 묻는 질문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.faq.map((item, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-xl">
                      <p className="font-semibold mb-2 flex items-start gap-2">
                        <span className="text-accent">Q.</span>
                        {item.question}
                      </p>
                      <p className="text-sm text-muted-foreground pl-5">
                        <span className="text-primary font-medium">A.</span> {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 커뮤니티 섹션 - 통합 게시판 */}
          <ProductBoardSection productSlug={slug} categorySlug={category} productName={product.name} />

          {/* Traps Section */}
          {product.traps && product.traps.length > 0 && (
            <Card className="card-base border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  구매 전 주의사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.traps.map((trap) => (
                    <div
                      key={trap.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg"
                    >
                      <Badge className="shrink-0 bg-amber-100 text-amber-700 border-amber-200">
                        {trap.trap_type}
                      </Badge>
                      <p className="text-sm">{trap.trap_description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alternatives */}
          {product.alternatives && product.alternatives.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">비슷한 대안</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {product.alternatives.slice(0, 3).map((alt) => (
                  <Link key={alt.id} href={`/${category}/model/${alt.slug}`}>
                    <Card className="card-base h-full hover:border-accent/50 transition-colors">
                      <CardContent className="p-4">
                        {/* 이미지 - 이미지 준비 완료 시 SHOW_PRODUCT_IMAGES를 true로 변경 */}
                        {SHOW_PRODUCT_IMAGES && (
                          <div className="aspect-square bg-muted rounded-xl mb-3 flex items-center justify-center">
                            {alt.image_url ? (
                              <img
                                src={alt.image_url}
                                alt={alt.name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <span className="text-3xl">{categoryInfo.icon}</span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">{alt.brand.name}</p>
                        <p className="font-semibold text-sm truncate">{alt.name}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <TierBadge tier={alt.tier} size="sm" showLabel={false} />
                          <span className="text-sm font-medium">{alt.tier_score.toFixed(1)}점</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 1/3 (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Price Card */}
            <Card className="card-base">
              <CardContent className="py-5">
                <p className="text-sm text-muted-foreground mb-1">가격대</p>
                <p className="text-2xl font-bold">
                  {product.price_min?.toLocaleString() || '15,000'}원
                  <span className="text-base font-normal text-muted-foreground"> ~ </span>
                  {product.price_max?.toLocaleString() || '25,000'}원
                </p>

                <div className="flex flex-col gap-2 mt-4">
                  {product.coupang_link ? (
                    <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                      <a href={product.coupang_link} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        쿠팡에서 구매
                        <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      최저가 검색
                    </Button>
                  )}
                  {product.naver_link ? (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={product.naver_link} target="_blank" rel="noopener noreferrer">
                        네이버 최저가 보기
                        <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      가격 비교하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Repurchase Rate */}
            <Card className="card-base gradient-primary text-white overflow-hidden">
              <CardContent className="py-5 text-center relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-4 w-4 opacity-80" />
                  <span className="text-sm opacity-80">비슷한 조건 {Math.floor(Math.random() * 100 + 100)}명 중</span>
                </div>
                <p className="text-4xl font-bold mb-1">{Math.floor(Math.random() * 20 + 70)}%</p>
                <p className="text-sm opacity-80 flex items-center justify-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  재구매율
                </p>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card className="card-base">
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">평균 평점</span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={4} />
                    <span className="font-bold">4.3</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percent = star === 5 ? 58 : star === 4 ? 28 : star === 3 ? 10 : star === 2 ? 3 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-3">{star}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <Progress value={percent} className="flex-1 h-2" />
                        <span className="w-8 text-right text-muted-foreground">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quiz CTA */}
            <Card className="card-base bg-accent/5 border-accent/20">
              <CardContent className="py-5 text-center">
                <p className="font-medium mb-2">이 제품이 나에게 맞을까?</p>
                <p className="text-sm text-muted-foreground mb-4">
                  3분 테스트로 확인해보세요
                </p>
                <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                  <Link href={`/${category}/quiz`}>무료 테스트 시작</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Report */}
            <Card className="card-base">
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  제품 정보가 잘못되었나요?
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`mailto:contact@gyegeupdo.kr?subject=[정보수정] ${product?.brand?.name || ''} ${product?.name || ''}&body=수정이 필요한 내용을 작성해주세요.`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    정보 수정 요청
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
