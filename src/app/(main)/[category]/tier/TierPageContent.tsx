'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useBrands, useCategory } from '@/hooks/useBrands';
import { TierGrid } from '@/components/tier/TierGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TierBadge } from '@/components/tier/TierBadge';
import {
  Download,
  Filter,
  X,
  Sparkles,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Users,
  MessageCircle,
  Clock,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { TierLevel } from '@/lib/tier';
import { ShareButtons } from '@/components/share/ShareButtons';

interface TierPageContentProps {
  category: string;
}

// 카테고리별 필터 설정
const CATEGORY_FILTERS: Record<string, {
  budget: { value: string; label: string }[];
  type: { value: string; label: string }[];
  usage: { key: string; label: string; description: string; icon: string }[];
}> = {
  'running-shoes': {
    budget: [
      { value: 'all', label: '전체' },
      { value: 'under10', label: '10만원 이하' },
      { value: '10to15', label: '10-15만원' },
      { value: '15to20', label: '15-20만원' },
      { value: 'over20', label: '20만원 이상' },
    ],
    type: [
      { value: 'all', label: '전체' },
      { value: 'cushion', label: '쿠션화' },
      { value: 'stability', label: '안정화' },
      { value: 'racing', label: '레이싱' },
      { value: 'trail', label: '트레일' },
    ],
    usage: [
      { key: 'race', label: '레이스/대회', description: '기록 도전용 최상급', icon: '🏆' },
      { key: 'daily', label: '데일리 트레이너', description: '일상 훈련용', icon: '🏃' },
      { key: 'beginner', label: '입문/초보', description: '처음 시작하는 러너', icon: '👟' },
      { key: 'long', label: '장거리/마라톤', description: '풀코스 마라톤용', icon: '🛤️' },
    ],
  },
  'chicken': {
    budget: [
      { value: 'all', label: '전체' },
      { value: 'under2', label: '2만원 이하' },
      { value: '2to2.5', label: '2-2.5만원' },
      { value: '2.5to3', label: '2.5-3만원' },
      { value: 'over3', label: '3만원 이상' },
    ],
    type: [
      { value: 'all', label: '전체' },
      { value: 'fried', label: '후라이드' },
      { value: 'yangnyum', label: '양념' },
      { value: 'soy', label: '간장' },
      { value: 'roasted', label: '구이' },
    ],
    usage: [
      { key: 'fried', label: '후라이드', description: '바삭한 기본의 정석', icon: '🍗' },
      { key: 'yangnyum', label: '양념', description: '달콤 매콤한 소스', icon: '🌶️' },
      { key: 'soy', label: '간장/허니', description: '달짭 간장 소스', icon: '🍯' },
      { key: 'powder', label: '가루/시즈닝', description: '파우더 시즈닝', icon: '✨' },
      { key: 'roasted', label: '구이', description: '오븐 구이 치킨', icon: '🔥' },
    ],
  },
};

// 용도별 계급도 실제 데이터 (커뮤니티 기반)
interface UsageTierItem {
  name: string;
  brand: string;
  slug: string;
  score: number;
  upVotes: number;
  downVotes: number;
}

const USAGE_TIER_DATA: Record<string, Record<string, Partial<Record<TierLevel, UsageTierItem[]>>>> = {
  'running-shoes': {
    race: {
      S: [
        { name: '알파플라이 3', brand: '나이키', slug: 'alphafly-3', score: 98, upVotes: 156, downVotes: 12 },
        { name: '아디오스 프로 에보1', brand: '아디다스', slug: 'adios-pro-evo1', score: 97, upVotes: 142, downVotes: 18 },
        { name: '베이퍼플라이 3', brand: '나이키', slug: 'vaporfly-3', score: 96, upVotes: 138, downVotes: 15 },
      ],
      A: [
        { name: '메타스피드 스카이 파리', brand: '아식스', slug: 'metaspeed-sky-paris', score: 93, upVotes: 98, downVotes: 22 },
        { name: '엔돌핀 프로 4', brand: '써코니', slug: 'endorphin-pro-4', score: 91, upVotes: 87, downVotes: 19 },
        { name: '퓨어셀 엘리트 v4', brand: '뉴발란스', slug: 'fuelcell-elite-v4', score: 90, upVotes: 82, downVotes: 21 },
      ],
      B: [
        { name: '씨엘로 X1', brand: '호카', slug: 'cielo-x1', score: 86, upVotes: 65, downVotes: 28 },
        { name: '웨이브 리벨리온 프로2', brand: '미즈노', slug: 'wave-rebellion-pro2', score: 84, upVotes: 58, downVotes: 25 },
      ],
    },
    daily: {
      S: [
        { name: '노바블라스트 4', brand: '아식스', slug: 'novablast-4', score: 95, upVotes: 245, downVotes: 18 },
        { name: '마하 6', brand: '호카', slug: 'mach-6', score: 93, upVotes: 198, downVotes: 22 },
        { name: '슈퍼블라스트', brand: '아식스', slug: 'superblast', score: 92, upVotes: 176, downVotes: 25 },
      ],
      A: [
        { name: '페가수스 41', brand: '나이키', slug: 'pegasus-41', score: 88, upVotes: 156, downVotes: 35 },
        { name: '퓨어셀 레벨 V4', brand: '뉴발란스', slug: 'fuelcell-rebel-v4', score: 87, upVotes: 142, downVotes: 32 },
        { name: '아디제로 보스턴 12', brand: '아디다스', slug: 'adizero-boston-12', score: 86, upVotes: 128, downVotes: 28 },
      ],
      B: [
        { name: '엔돌핀 스피드 4', brand: '써코니', slug: 'endorphin-speed-4', score: 83, upVotes: 95, downVotes: 38 },
        { name: '킨바라 15', brand: '써코니', slug: 'kinvara-15', score: 81, upVotes: 78, downVotes: 35 },
      ],
    },
    beginner: {
      S: [
        { name: '클리프톤 9', brand: '호카', slug: 'clifton-9', score: 96, upVotes: 312, downVotes: 15 },
        { name: '젤 님버스 26', brand: '아식스', slug: 'gel-nimbus-26', score: 94, upVotes: 278, downVotes: 22 },
        { name: '본디 8', brand: '호카', slug: 'bondi-8', score: 93, upVotes: 256, downVotes: 28 },
      ],
      A: [
        { name: '1080 v13', brand: '뉴발란스', slug: '1080-v13', score: 90, upVotes: 198, downVotes: 35 },
        { name: '인피니티 런 4', brand: '나이키', slug: 'infinity-run-4', score: 88, upVotes: 175, downVotes: 42 },
        { name: '글라이드라이드 4', brand: '아식스', slug: 'glideride-4', score: 86, upVotes: 152, downVotes: 38 },
      ],
      B: [
        { name: '고스트 15', brand: '브룩스', slug: 'ghost-15', score: 84, upVotes: 125, downVotes: 45 },
        { name: '웨이브 라이더 28', brand: '미즈노', slug: 'wave-rider-28', score: 82, upVotes: 108, downVotes: 42 },
      ],
    },
    long: {
      S: [
        { name: '젤 카야노 31', brand: '아식스', slug: 'gel-kayano-31', score: 95, upVotes: 198, downVotes: 18 },
        { name: '본디 9', brand: '호카', slug: 'bondi-9', score: 94, upVotes: 185, downVotes: 22 },
        { name: '젤 님버스 26', brand: '아식스', slug: 'gel-nimbus-26', score: 93, upVotes: 172, downVotes: 25 },
      ],
      A: [
        { name: '1080 v14', brand: '뉴발란스', slug: '1080-v14', score: 89, upVotes: 142, downVotes: 32 },
        { name: '클리프톤 10', brand: '호카', slug: 'clifton-10', score: 87, upVotes: 128, downVotes: 35 },
        { name: '트라이엄프 22', brand: '써코니', slug: 'triumph-22', score: 85, upVotes: 112, downVotes: 38 },
      ],
      B: [
        { name: '글리세린 21', brand: '브룩스', slug: 'glycerin-21', score: 83, upVotes: 92, downVotes: 42 },
        { name: '인피니티 런 4', brand: '나이키', slug: 'infinity-run-4', score: 81, upVotes: 78, downVotes: 38 },
      ],
    },
  },
  'chicken': {
    // 🍗 후라이드 계급도 (치킨 갤러리/커뮤니티 기반)
    fried: {
      S: [
        { name: '황금올리브치킨', brand: 'BBQ', slug: 'bbq-golden-olive', score: 97, upVotes: 524, downVotes: 28 },
        { name: '해바라기 후라이드', brand: 'BHC', slug: 'bhc-sunflower', score: 95, upVotes: 478, downVotes: 35 },
        { name: '오리지날 후라이드', brand: '호식이', slug: 'hosik-original', score: 94, upVotes: 445, downVotes: 38 },
      ],
      A: [
        { name: '후라이드치킨', brand: 'BHC', slug: 'bhc-fried', score: 91, upVotes: 358, downVotes: 52 },
        { name: '크리스피치킨', brand: 'KFC', slug: 'kfc-crispy', score: 89, upVotes: 312, downVotes: 58 },
        { name: '후라이드', brand: '노랑통닭', slug: 'norang-fried', score: 87, upVotes: 285, downVotes: 62 },
      ],
      B: [
        { name: '후라이드', brand: '60계', slug: '60gye-fried', score: 84, upVotes: 225, downVotes: 72 },
        { name: '후라이드', brand: '맘스터치', slug: 'moms-fried', score: 82, upVotes: 198, downVotes: 78 },
      ],
    },
    // 🌶️ 양념 계급도
    yangnyum: {
      S: [
        { name: '양념치킨', brand: '페리카나', slug: 'pericana-yangnyum', score: 96, upVotes: 498, downVotes: 32 },
        { name: '양념치킨', brand: 'BHC', slug: 'bhc-yangnyum', score: 95, upVotes: 465, downVotes: 38 },
        { name: '레드콤보', brand: '교촌', slug: 'kyochon-red', score: 94, upVotes: 432, downVotes: 42 },
      ],
      A: [
        { name: '슈프림양념', brand: '처갓집', slug: 'cheogajip-supreme', score: 91, upVotes: 368, downVotes: 55 },
        { name: '양념치킨', brand: '60계', slug: '60gye-yangnyum', score: 89, upVotes: 325, downVotes: 62 },
        { name: '매운양념', brand: '또래오래', slug: 'ttorae-hot', score: 87, upVotes: 285, downVotes: 68 },
      ],
      B: [
        { name: '양념치킨', brand: '노랑통닭', slug: 'norang-yangnyum', score: 84, upVotes: 218, downVotes: 75 },
        { name: '양념치킨', brand: '네네', slug: 'nene-yangnyum', score: 82, upVotes: 192, downVotes: 82 },
      ],
    },
    // 🍯 간장/허니 계급도
    soy: {
      S: [
        { name: '교촌 오리지날', brand: '교촌', slug: 'kyochon-original', score: 97, upVotes: 545, downVotes: 25 },
        { name: '간장치킨', brand: '호식이', slug: 'hosik-soy', score: 95, upVotes: 498, downVotes: 32 },
        { name: '맛초킹', brand: 'BHC', slug: 'bhc-matchoking', score: 94, upVotes: 468, downVotes: 38 },
      ],
      A: [
        { name: '허니콤보', brand: '교촌', slug: 'kyochon-honey', score: 91, upVotes: 378, downVotes: 52 },
        { name: '소이갈릭', brand: 'BBQ', slug: 'bbq-soy-garlic', score: 89, upVotes: 328, downVotes: 58 },
        { name: '간장치킨', brand: '네네', slug: 'nene-soy', score: 87, upVotes: 292, downVotes: 65 },
      ],
      B: [
        { name: '간장치킨', brand: '자담', slug: 'jadam-soy', score: 84, upVotes: 225, downVotes: 72 },
        { name: '간장치킨', brand: '60계', slug: '60gye-soy', score: 82, upVotes: 198, downVotes: 78 },
      ],
    },
    // ✨ 가루/시즈닝 계급도
    powder: {
      S: [
        { name: '뿌링클', brand: 'BHC', slug: 'bhc-puringkle', score: 98, upVotes: 612, downVotes: 22 },
        { name: '치토스치킨', brand: 'KFC', slug: 'kfc-cheetos', score: 94, upVotes: 445, downVotes: 42 },
        { name: '스노윙치즈', brand: '네네', slug: 'nene-snowing', score: 93, upVotes: 418, downVotes: 45 },
      ],
      A: [
        { name: '크크크치킨', brand: '60계', slug: '60gye-kkk', score: 90, upVotes: 358, downVotes: 55 },
        { name: '치즈볼', brand: 'BBQ', slug: 'bbq-cheeseball', score: 88, upVotes: 312, downVotes: 62 },
        { name: '마라크치킨', brand: 'BHC', slug: 'bhc-marak', score: 86, upVotes: 278, downVotes: 68 },
      ],
      B: [
        { name: '뿌링핫', brand: 'BHC', slug: 'bhc-puringhot', score: 83, upVotes: 215, downVotes: 75 },
        { name: '갈릭파우더', brand: '굽네', slug: 'goobne-garlic', score: 81, upVotes: 188, downVotes: 82 },
      ],
    },
    // 🔥 구이 계급도
    roasted: {
      S: [
        { name: '고추바사삭', brand: '굽네', slug: 'goobne-gochu', score: 96, upVotes: 512, downVotes: 28 },
        { name: '굽네 오리지날', brand: '굽네', slug: 'goobne-original', score: 95, upVotes: 478, downVotes: 32 },
        { name: '자메이카통다리', brand: 'BBQ', slug: 'bbq-jamaica', score: 94, upVotes: 445, downVotes: 38 },
      ],
      A: [
        { name: '볼케이노', brand: '굽네', slug: 'goobne-volcano', score: 91, upVotes: 368, downVotes: 52 },
        { name: '블랙알리오', brand: '푸라닭', slug: 'puradak-black-allio', score: 89, upVotes: 325, downVotes: 58 },
        { name: '갈비치킨', brand: 'BHC', slug: 'bhc-galbi', score: 87, upVotes: 285, downVotes: 65 },
      ],
      B: [
        { name: '훈제치킨', brand: '네네', slug: 'nene-smoked', score: 84, upVotes: 218, downVotes: 72 },
        { name: '마늘바게트', brand: '굽네', slug: 'goobne-garlic-baguette', score: 82, upVotes: 192, downVotes: 78 },
      ],
    },
  },
};

// 기본 필터 (fallback)
const DEFAULT_FILTERS = {
  budget: [{ value: 'all', label: '전체' }],
  type: [{ value: 'all', label: '전체' }],
  usage: [],
};

// HOT 이의 데이터
const HOT_DISPUTES: Record<string, {
  productId: number;
  productName: string;
  productSlug: string;
  brandName: string;
  currentTier: TierLevel;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  topComment: {
    userName: string;
    voteType: 'up' | 'down';
    comment: string;
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
        userName: '러닝매니아',
        voteType: 'up',
        comment: '쿠셔닝이 정말 좋고 반발력도 훌륭합니다. S티어 자격 충분해요.',
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
        userName: '마라토너K',
        voteType: 'down',
        comment: '내구성이 이전 버전보다 많이 떨어집니다. B티어가 맞다고 봅니다.',
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
        userName: '치킨마니아',
        voteType: 'up',
        comment: '매콤한 맛이 정말 중독적이에요. A티어 가치 충분합니다!',
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
        userName: '야식러버',
        voteType: 'down',
        comment: '양이 좀 아쉽고 가격 대비 만족도가 떨어집니다.',
      },
      daysLeft: 2,
    },
  ],
};

// 커뮤니티 리뷰 데이터
const RECENT_REVIEWS: Record<string, {
  id: number;
  user: { name: string; type: string };
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
      user: { name: '러닝좋아', type: '평발 / 넓은 발' },
      model: { name: '노바블라스트 5', brand: '아식스', tier: 'A', slug: 'novablast-5' },
      rating: 5,
      content: '평발인데 아치 서포트가 적당하고 쿠셔닝이 정말 좋아요. 10km 이상 달려도 발이 편합니다.',
      likes: 24,
      comments: 5,
      createdAt: '2시간 전',
    },
    {
      id: 2,
      user: { name: '마라토너K', type: '보통 / 보통 발' },
      model: { name: '알파플라이 3', brand: '나이키', tier: 'S', slug: 'alphafly-3' },
      rating: 4,
      content: '가격이 비싸지만 레이스용으로는 최고입니다. 다만 내구성은 좀 아쉬워요.',
      likes: 18,
      comments: 3,
      createdAt: '5시간 전',
    },
    {
      id: 3,
      user: { name: '초보러너', type: '오버프로네이션 / 좁은 발' },
      model: { name: '젤 카야노 31', brand: '아식스', tier: 'S', slug: 'gel-kayano-31' },
      rating: 5,
      content: '오버프로네이션 교정이 필요한 분들께 강력 추천합니다. 안정성이 뛰어나요.',
      likes: 31,
      comments: 8,
      createdAt: '1일 전',
    },
    {
      id: 4,
      user: { name: '런런런', type: '정상 / 보통 발' },
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
      user: { name: '치킨마스터', type: '매운맛 좋아함' },
      model: { name: '뿌링클', brand: 'BHC', tier: 'S', slug: 'bhc-puringkle' },
      rating: 5,
      content: '치즈 시즈닝이 정말 맛있어요. 맥주 안주로 최고입니다. 재주문 확정!',
      likes: 32,
      comments: 7,
      createdAt: '1시간 전',
    },
    {
      id: 102,
      user: { name: '야식킹', type: '바삭함 선호' },
      model: { name: '황금올리브치킨', brand: 'BBQ', tier: 'S', slug: 'bbq-golden-olive' },
      rating: 5,
      content: '올리브유로 튀겨서 담백하고 바삭해요. 치킨 본연의 맛을 느끼기 좋습니다.',
      likes: 28,
      comments: 4,
      createdAt: '3시간 전',
    },
    {
      id: 103,
      user: { name: '혼닭러버', type: '가성비 중시' },
      model: { name: '교촌 오리지날', brand: '교촌', tier: 'S', slug: 'kyochon-original' },
      rating: 4,
      content: '간장 소스가 은은하게 배어서 좋아요. 다만 양이 조금 아쉽습니다.',
      likes: 19,
      comments: 3,
      createdAt: '5시간 전',
    },
    {
      id: 104,
      user: { name: '파티플래너', type: '모임용' },
      model: { name: '굽네 고추바사삭', brand: '굽네', tier: 'A', slug: 'goobne-gochu' },
      rating: 4,
      content: '오븐에 구워서 건강한 느낌이에요. 매콤한 맛이 좋고 살짝 덜 느끼해요.',
      likes: 15,
      comments: 2,
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
          className={`h-3.5 w-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

export function TierPageContent({ category }: TierPageContentProps) {
  const { data: brands, isLoading, error } = useBrands(category);
  const { data: categoryData } = useCategory(category);
  const tierGridRef = useRef<HTMLDivElement>(null);

  // 카테고리별 필터 가져오기
  const filters = CATEGORY_FILTERS[category] || DEFAULT_FILTERS;
  const BUDGET_FILTERS = filters.budget;
  const TYPE_FILTERS = filters.type;
  const USAGE_CATEGORIES = filters.usage;

  // Filter states
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">브랜드 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !brands) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const scoreDefinitions = categoryData?.brand_score_definitions || [
    { key: 'lineup', label: '라인업 점수', weight: 25 },
    { key: 'tech', label: '기술력 점수', weight: 30 },
    { key: 'durability', label: '내구성 점수', weight: 25 },
    { key: 'community', label: '커뮤니티 점수', weight: 20 },
  ];

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
        ctx.fillText('gyegeupdo.kr', canvas.width - 20, canvas.height - 20);

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

  const hasActiveFilters = budgetFilter !== 'all' || typeFilter !== 'all';

  const clearFilters = () => {
    setBudgetFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {categoryData?.name || '제품'} 계급도
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            커뮤니티 리뷰와 {brands.length}개 브랜드 데이터 기반
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={hasActiveFilters ? 'border-accent text-accent' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            필터
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {[budgetFilter, typeFilter].filter(f => f !== 'all').length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadImage}>
            <Download className="h-4 w-4 mr-2" />
            이미지 저장
          </Button>
          <ShareButtons
            title={`${categoryData?.name || '제품'} 계급도 - 계급도`}
            description={`커뮤니티 리뷰 기반 ${categoryData?.name || '제품'} 티어 순위표`}
            variant="compact"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="card-base">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">필터</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  초기화
                </Button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Budget Filter */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">예산</p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setBudgetFilter(filter.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm transition-colors
                        ${budgetFilter === filter.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted-foreground/10'
                        }
                      `}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">타입</p>
                <div className="flex flex-wrap gap-2">
                  {TYPE_FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setTypeFilter(filter.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm transition-colors
                        ${typeFilter === filter.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted-foreground/10'
                        }
                      `}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            {USAGE_CATEGORIES.map((usage) => {
              const usageTiers = USAGE_TIER_DATA[category]?.[usage.key] || {};

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
                    {(['S', 'A', 'B'] as TierLevel[]).map((tier) => {
                      const items = usageTiers[tier] || [];
                      const tierGradients: Record<TierLevel, string> = {
                        S: 'linear-gradient(135deg, #FFC0CB 0%, #FFB6C1 50%, #FF9CAD 100%)',
                        A: 'linear-gradient(135deg, #FFE4C9 0%, #FFDAB9 50%, #FFCBA4 100%)',
                        B: 'linear-gradient(135deg, #FFFFF0 0%, #FFFFE0 50%, #FFFACD 100%)',
                        C: 'linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #CA8A04 100%)',
                        D: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                      };
                      const tierShadows: Record<TierLevel, string> = {
                        S: '0 0 12px rgba(255, 182, 193, 0.5)',
                        A: '0 0 10px rgba(255, 218, 185, 0.5)',
                        B: '0 0 8px rgba(255, 255, 224, 0.5)',
                        C: 'none',
                        D: 'none',
                      };
                      return (
                        <div key={tier} className="flex border-b last:border-b-0">
                          {/* 티어 라벨 */}
                          <div
                            className="w-16 shrink-0 flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: tierGradients[tier],
                              boxShadow: tierShadows[tier],
                            }}
                          >
                            {/* 광택 효과 */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5" />
                            <span className="text-xl font-black relative z-10 text-black">
                              {tier}급
                            </span>
                          </div>

                          {/* 제품 목록 */}
                          <div className="flex-1 p-2 bg-muted/30 flex flex-wrap gap-1.5 min-h-[60px] items-center">
                            {items.length === 0 ? (
                              <span className="text-sm text-muted-foreground italic">아직 데이터가 없습니다</span>
                            ) : (
                              items.map((item) => (
                                <Link
                                  key={item.slug}
                                  href={`/${category}/model/${item.slug}`}
                                  className="group"
                                >
                                  <div className="bg-card border rounded-lg px-3 py-2 hover:border-accent hover:shadow-md transition-all">
                                    <p className="text-[10px] text-muted-foreground">{item.brand}</p>
                                    <p className="font-medium text-sm group-hover:text-accent transition-colors line-clamp-1">
                                      {item.name}
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
        </TabsContent>

        <TabsContent value="brand">
          <div ref={tierGridRef} className="bg-card p-4 rounded-2xl">
            <TierGrid brands={brands} category={category} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Interactive Features CTAs */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Quiz CTA */}
        <Card className="card-base border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 hover:border-accent/50 transition-all">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl mb-3">
              🎯
            </div>
            <h3 className="font-bold mb-1">
              {category === 'running-shoes' ? '나에게 맞는 러닝화 찾기' : category === 'chicken' ? '나에게 맞는 치킨 찾기' : '맞춤 추천'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              3분 퀴즈로 취향에 맞는 제품을 찾아보세요
            </p>
            <Button className="w-full bg-accent hover:bg-accent/90" asChild>
              <Link href={`/${category}/quiz`}>퀴즈 시작 <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Tier CTA */}
        <Card className="card-base border-purple-300/30 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 hover:border-purple-400/50 transition-all">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl mb-3">
              🎨
            </div>
            <h3 className="font-bold mb-1">나의 계급도 만들기</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              드래그로 나만의 계급도를 만들고 친구들과 공유하세요
            </p>
            <Button variant="outline" className="w-full border-purple-300 hover:bg-purple-50" asChild>
              <Link href={`/${category}/my-tier`}>만들기 <ArrowRight className="ml-1 h-4 w-4" /></Link>
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

      {/* Scoring Criteria */}
      <Card className="card-base">
        <CardContent className="py-6">
          <h3 className="font-semibold mb-4">계급도 평가 기준</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {scoreDefinitions.map((def) => (
              <div key={def.key} className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-accent">{def.label}</p>
                <p className="text-xs text-muted-foreground mt-1">가중치 {def.weight}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* HOT 이의 섹션 */}
      {(() => {
        const disputes = HOT_DISPUTES[category] || [];
        if (disputes.length === 0) return null;

        return (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">이번 주 HOT 이의</h2>
                <p className="text-sm text-muted-foreground">커뮤니티 등급 조정 투표</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/community/disputes">전체 이의 보기</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {disputes.map((dispute) => {
                const upPercent = Math.round((dispute.upVotes / dispute.totalVotes) * 100);
                const downPercent = 100 - upPercent;
                const isUpTrending = dispute.upVotes > dispute.downVotes;

                return (
                  <Link key={dispute.productId} href={`/${category}/model/${dispute.productSlug}`}>
                    <Card className="card-base h-full hover:border-accent/50 transition-colors">
                      <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
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
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground">{dispute.brandName}</p>
                          <h3 className="font-semibold">{dispute.productName}</h3>
                        </div>

                        {/* Vote Progress */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <ChevronUp className="h-3 w-3" />UP {upPercent}%
                            </span>
                            <span className="text-red-600 font-medium flex items-center gap-1">
                              DOWN {downPercent}%<ChevronDown className="h-3 w-3" />
                            </span>
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
                            <span>{dispute.totalVotes}명 투표</span>
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
        );
      })()}

      {/* 커뮤니티 리뷰 섹션 */}
      {(() => {
        const reviews = RECENT_REVIEWS[category] || [];
        const categoryName = categoryData?.name || '제품';

        return (
          <section className="py-6 bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">커뮤니티 리뷰</h2>
                <p className="text-sm text-muted-foreground">실제 사용자들의 솔직한 후기</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/community/reviews">전체 리뷰 보기</Link>
              </Button>
            </div>

            {/* 리뷰 작성 CTA */}
            <Card className="card-base mb-4 border-accent/30 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">내 {categoryName} 리뷰 남기기</p>
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
              {reviews.map((review) => (
                <Card key={review.id} className="card-base">
                  <CardContent className="p-4">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
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
                      href={`/${category}/model/${review.model.slug}`}
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
        );
      })()}
    </div>
  );
}
