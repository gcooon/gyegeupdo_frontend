'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useBrands, useCategory } from '@/hooks/useBrands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TierBadge } from '@/components/tier/TierBadge';
import { TierGrid } from '@/components/tier/TierGrid';
import { ShareButtons } from '@/components/share/ShareButtons';
import { TIER_CONFIG } from '@/lib/tier';
import type { TierLevel } from '@/lib/tier';
import {
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
  Download,
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

// 카테고리별 용도 설정
const USAGE_CATEGORIES: Record<string, { key: string; label: string; description: string; icon: string }[]> = {
  'running-shoes': [
    { key: 'race', label: '레이스/대회', description: '기록 도전용 최상급', icon: '🏆' },
    { key: 'daily', label: '데일리 트레이너', description: '일상 훈련용', icon: '🏃' },
    { key: 'beginner', label: '입문/초보', description: '처음 시작하는 러너', icon: '👟' },
    { key: 'long', label: '장거리/마라톤', description: '풀코스 마라톤용', icon: '🛤️' },
  ],
  'chicken': [
    { key: 'fried', label: '후라이드', description: '바삭한 기본의 정석', icon: '🍗' },
    { key: 'yangnyum', label: '양념', description: '달콤 매콤한 소스', icon: '🌶️' },
    { key: 'soy', label: '간장/허니', description: '달짭 간장 소스', icon: '🍯' },
    { key: 'powder', label: '가루/시즈닝', description: '파우더 시즈닝', icon: '✨' },
    { key: 'roasted', label: '구이', description: '오븐 구이 치킨', icon: '🔥' },
  ],
};

// 용도별 계급도 데이터
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
  const tierGridRef = useRef<HTMLDivElement>(null);

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['running-shoes'];
  const trending = TRENDING_DATA[category] || [];
  const disputes = DISPUTE_DATA[category] || [];
  const reviews = REVIEW_DATA[category] || [];
  const usageCategories = USAGE_CATEGORIES[category] || [];

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
              {usageCategories.map((usage) => {
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
                      {(['S', 'A', 'B', 'C'] as TierLevel[]).map((tier) => {
                        const items = usageTiers[tier] || [];
                        const tierColors: Record<TierLevel, string> = {
                          S: '#FFD700',  // 황제 - Gold
                          A: '#9370DB',  // 왕 - Purple
                          B: '#4169E1',  // 양반 - Royal Blue
                          C: '#3CB371',  // 중인 - Green
                        };
                        const tierLabels: Record<TierLevel, string> = {
                          S: '황제',
                          A: '왕',
                          B: '양반',
                          C: '중인',
                        };
                        return (
                          <div key={tier} className="flex border-b last:border-b-0">
                            {/* 티어 라벨 */}
                            <div
                              className="w-16 shrink-0 flex items-center justify-center"
                              style={{
                                backgroundColor: tierColors[tier],
                              }}
                            >
                              <span className={`text-lg font-black ${tier === 'S' ? 'text-black' : 'text-white'}`}>
                                {tierLabels[tier]}
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
