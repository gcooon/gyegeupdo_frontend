'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useBrands, useCategory } from '@/hooks/useBrands';
import type { Brand, Category } from '@/types/model';
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
  initialBrands?: import('@/types/model').Brand[];
  initialCategory?: import('@/types/model').Category;
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
  'mens-watch': {
    name: '남자시계',
    icon: '⌚',
    color: '#1E3A5F',
    heroTitle: '남자시계 계급도',
    heroDescription: '한눈에 비교하세요',
    heroSubDescription: '커뮤니티 반응과 브랜드 가치를 바탕으로 S~D 티어로 분류된 시계 순위표',
    itemLabel: '브랜드',
    quizCTA: '나에게 맞는 시계 찾기',
    stats: {
      modelCount: '24',
      reviewCount: '1,200+',
      brandCount: '20',
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
  'mens-watch': [
    { key: 'dress', label: '드레스워치', description: '격식있는 자리에', icon: '👔' },
    { key: 'sport', label: '스포츠/다이버', description: '활동적인 스타일', icon: '🏊' },
    { key: 'daily', label: '데일리', description: '매일 편하게', icon: '⌚' },
    { key: 'investment', label: '투자/컬렉션', description: '리셀 가치 중시', icon: '💎' },
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
        { name: '메타스피드 스카이 도쿄', brand: '아식스', slug: 'metaspeed-sky-tokyo', score: 98, upVotes: 234, downVotes: 12 },
        { name: '알파플라이 3', brand: '나이키', slug: 'alphafly-3', score: 97, upVotes: 198, downVotes: 15 },
        { name: '패스트-R 3', brand: '푸마', slug: 'fast-r-3', score: 97, upVotes: 178, downVotes: 14 },
        { name: '베이퍼플라이 3', brand: '나이키', slug: 'vaporfly-3', score: 96, upVotes: 165, downVotes: 18 },
      ],
      A: [
        { name: '메타스피드 스카이 파리', brand: '아식스', slug: 'metaspeed-sky-paris', score: 94, upVotes: 142, downVotes: 22 },
        { name: '아디오스 프로 3', brand: '아디다스', slug: 'adizero-adios-pro-3', score: 93, upVotes: 128, downVotes: 25 },
        { name: '슈퍼컴프 엘리트 v4', brand: '뉴발란스', slug: 'supercomp-elite-v4', score: 92, upVotes: 115, downVotes: 21 },
      ],
      B: [
        { name: '로켓 X 2', brand: '호카', slug: 'rocket-x-2', score: 88, upVotes: 95, downVotes: 28 },
        { name: '엔돌핀 프로 4', brand: '써코니', slug: 'endorphin-pro-4', score: 86, upVotes: 85, downVotes: 25 },
      ],
      C: [
        { name: '킵런 KD900X', brand: '데카트론', slug: 'kiprun-kd900x', score: 72, upVotes: 45, downVotes: 38 },
        { name: '플로트라이드 에너지 5', brand: '리복', slug: 'floatride-energy-5', score: 70, upVotes: 38, downVotes: 42 },
      ],
      D: [
        { name: '탑텐 러닝화', brand: '탑텐', slug: 'topten-running', score: 42, upVotes: 12, downVotes: 78 },
      ],
    },
    daily: {
      S: [
        { name: '노바블라스트 5', brand: '아식스', slug: 'novablast-5', score: 96, upVotes: 1245, downVotes: 45 },
        { name: '마하 X', brand: '호카', slug: 'mach-x', score: 94, upVotes: 423, downVotes: 32 },
        { name: '슈퍼블라스트 2', brand: '아식스', slug: 'superblast-2', score: 93, upVotes: 312, downVotes: 28 },
        { name: '매그니파이 니트로 3', brand: '푸마', slug: 'magnify-nitro-3', score: 92, upVotes: 289, downVotes: 25 },
      ],
      A: [
        { name: '페가수스 41', brand: '나이키', slug: 'pegasus-41', score: 88, upVotes: 425, downVotes: 55 },
        { name: '퓨얼셀 레벨 v4', brand: '뉴발란스', slug: 'fuelcell-rebel-v4', score: 89, upVotes: 198, downVotes: 32 },
        { name: '보스턴 12', brand: '아디다스', slug: 'boston-12', score: 87, upVotes: 189, downVotes: 35 },
        { name: '클라우드몬스터', brand: '온러닝', slug: 'cloudmonster', score: 86, upVotes: 234, downVotes: 42 },
      ],
      B: [
        { name: '마하 6', brand: '호카', slug: 'mach-6', score: 84, upVotes: 167, downVotes: 48 },
        { name: '킨바라 15', brand: '써코니', slug: 'kinvara-15', score: 82, upVotes: 145, downVotes: 45 },
      ],
      C: [
        { name: '고런 맥스로드 6', brand: '스케쳐스', slug: 'gorun-maxroad-6', score: 72, upVotes: 89, downVotes: 65 },
        { name: '킵런 KS500', brand: '데카트론', slug: 'kiprun-ks500', score: 70, upVotes: 78, downVotes: 72 },
        { name: '레볼루션 7', brand: '나이키', slug: 'revolution-7', score: 68, upVotes: 125, downVotes: 98 },
        { name: '갤럭시 7', brand: '아디다스', slug: 'galaxy-7', score: 66, upVotes: 112, downVotes: 105 },
        { name: '플로트 맥스 2', brand: '필라', slug: 'float-max-2', score: 64, upVotes: 67, downVotes: 88 },
      ],
      D: [
        { name: '탑텐 러닝화', brand: '탑텐', slug: 'topten-running', score: 45, upVotes: 34, downVotes: 156 },
        { name: '스파오 스니커즈', brand: '스파오', slug: 'spao-sneakers', score: 38, upVotes: 23, downVotes: 187 },
        { name: '노브랜드 러닝화', brand: '노브랜드', slug: 'nobrand-running', score: 35, upVotes: 18, downVotes: 212 },
      ],
    },
    beginner: {
      S: [
        { name: '클리프톤 10', brand: '호카', slug: 'clifton-10', score: 96, upVotes: 892, downVotes: 35 },
        { name: '노바블라스트 5', brand: '아식스', slug: 'novablast-5', score: 96, upVotes: 756, downVotes: 28 },
        { name: '젤 님버스 27', brand: '아식스', slug: 'gel-nimbus-27', score: 94, upVotes: 523, downVotes: 32 },
        { name: '본디 9', brand: '호카', slug: 'bondi-9', score: 94, upVotes: 567, downVotes: 38 },
      ],
      A: [
        { name: '프레시폼 1080 v14', brand: '뉴발란스', slug: 'fresh-foam-1080-v14', score: 91, upVotes: 412, downVotes: 45 },
        { name: '라이드 18', brand: '써코니', slug: 'ride-18', score: 90, upVotes: 456, downVotes: 52 },
        { name: '페가수스 41', brand: '나이키', slug: 'pegasus-41', score: 88, upVotes: 385, downVotes: 48 },
      ],
      B: [
        { name: '고스트 17', brand: '브룩스', slug: 'ghost-17', score: 85, upVotes: 285, downVotes: 55 },
        { name: '클라우드서퍼', brand: '온러닝', slug: 'cloudsurfer', score: 83, upVotes: 178, downVotes: 52 },
      ],
      C: [
        { name: '젤 컨텐드 8', brand: '아식스', slug: 'gel-contend-8', score: 72, upVotes: 178, downVotes: 125 },
        { name: '졸트 4', brand: '아식스', slug: 'jolt-4', score: 70, upVotes: 156, downVotes: 138 },
        { name: '에어로 버스트', brand: '스케쳐스', slug: 'aero-burst', score: 68, upVotes: 89, downVotes: 112 },
        { name: '레볼루션 7', brand: '나이키', slug: 'revolution-7', score: 66, upVotes: 145, downVotes: 167 },
        { name: '스피드러쉬', brand: '프로스펙스', slug: 'speedrush', score: 64, upVotes: 78, downVotes: 134 },
      ],
      D: [
        { name: '탑텐 러닝화', brand: '탑텐', slug: 'topten-running', score: 48, upVotes: 56, downVotes: 234 },
        { name: '스파오 스니커즈', brand: '스파오', slug: 'spao-sneakers', score: 42, upVotes: 34, downVotes: 267 },
        { name: '노브랜드 러닝화', brand: '노브랜드', slug: 'nobrand-running', score: 38, upVotes: 23, downVotes: 298 },
        { name: '다이소 운동화', brand: '다이소', slug: 'daiso-running', score: 32, upVotes: 12, downVotes: 345 },
      ],
    },
    long: {
      S: [
        { name: '젤 님버스 27', brand: '아식스', slug: 'gel-nimbus-27', score: 96, upVotes: 523, downVotes: 25 },
        { name: '본디 9', brand: '호카', slug: 'bondi-9', score: 95, upVotes: 485, downVotes: 28 },
        { name: '젤 카야노 31', brand: '아식스', slug: 'gel-kayano-31', score: 95, upVotes: 412, downVotes: 22 },
      ],
      A: [
        { name: '프레시폼 1080 v14', brand: '뉴발란스', slug: 'fresh-foam-1080-v14', score: 91, upVotes: 342, downVotes: 38 },
        { name: '클리프톤 10', brand: '호카', slug: 'clifton-10', score: 90, upVotes: 328, downVotes: 42 },
        { name: '트라이엄프 22', brand: '써코니', slug: 'triumph-22', score: 88, upVotes: 267, downVotes: 45 },
      ],
      B: [
        { name: '글리세린 21', brand: '브룩스', slug: 'glycerin-21', score: 85, upVotes: 198, downVotes: 52 },
        { name: '인빈서블 3', brand: '나이키', slug: 'invincible-3', score: 84, upVotes: 178, downVotes: 48 },
      ],
      C: [
        { name: '웨이브 라이더 27', brand: '미즈노', slug: 'wave-rider-27', score: 74, upVotes: 134, downVotes: 98 },
        { name: '고런 맥스로드 6', brand: '스케쳐스', slug: 'gorun-maxroad-6', score: 70, upVotes: 112, downVotes: 125 },
        { name: '킵런 KD900X', brand: '데카트론', slug: 'kiprun-kd900x', score: 68, upVotes: 89, downVotes: 134 },
        { name: '에너지 부스트', brand: '데상트', slug: 'energy-boost', score: 65, upVotes: 67, downVotes: 156 },
      ],
      D: [
        { name: '탑텐 러닝화', brand: '탑텐', slug: 'topten-running', score: 40, upVotes: 23, downVotes: 289 },
        { name: '노브랜드 러닝화', brand: '노브랜드', slug: 'nobrand-running', score: 35, upVotes: 12, downVotes: 334 },
      ],
    },
    stability: {
      S: [
        { name: '젤 카야노 31', brand: '아식스', slug: 'gel-kayano-31', score: 96, upVotes: 412, downVotes: 18 },
        { name: '아라히 8', brand: '호카', slug: 'arahi-8', score: 94, upVotes: 345, downVotes: 22 },
      ],
      A: [
        { name: '스트럭처 25', brand: '나이키', slug: 'structure-25', score: 90, upVotes: 245, downVotes: 35 },
        { name: '아라히 7', brand: '호카', slug: 'arahi-7', score: 88, upVotes: 178, downVotes: 32 },
        { name: 'GT-2000 13', brand: '아식스', slug: 'gt-2000-13', score: 87, upVotes: 156, downVotes: 38 },
      ],
      B: [
        { name: '가이드 17', brand: '써코니', slug: 'guide-17', score: 84, upVotes: 125, downVotes: 42 },
        { name: '아드레날린 GTS 24', brand: '브룩스', slug: 'adrenaline-gts-24', score: 83, upVotes: 112, downVotes: 45 },
      ],
      C: [
        { name: '젤 컨텐드 8', brand: '아식스', slug: 'gel-contend-8', score: 70, upVotes: 89, downVotes: 98 },
        { name: '웨이브 라이더 27', brand: '미즈노', slug: 'wave-rider-27', score: 68, upVotes: 78, downVotes: 112 },
        { name: '스피드러쉬', brand: '프로스펙스', slug: 'speedrush', score: 62, upVotes: 56, downVotes: 145 },
      ],
      D: [
        { name: '탑텐 러닝화', brand: '탑텐', slug: 'topten-running', score: 38, upVotes: 18, downVotes: 267 },
        { name: '스파오 스니커즈', brand: '스파오', slug: 'spao-sneakers', score: 32, upVotes: 12, downVotes: 312 },
      ],
    },
    tempo: {
      S: [
        { name: '엔돌핀 스피드 5', brand: '써코니', slug: 'endorphin-speed-5', score: 96, upVotes: 378, downVotes: 22 },
        { name: '마하 X', brand: '호카', slug: 'mach-x', score: 95, upVotes: 356, downVotes: 25 },
        { name: '매직 스피드 4', brand: '아식스', slug: 'magic-speed-4', score: 93, upVotes: 312, downVotes: 28 },
      ],
      A: [
        { name: '퓨얼셀 레벨 v4', brand: '뉴발란스', slug: 'fuelcell-rebel-v4', score: 90, upVotes: 245, downVotes: 35 },
        { name: '보스턴 12', brand: '아디다스', slug: 'boston-12', score: 89, upVotes: 198, downVotes: 32 },
        { name: '줌 플라이 6', brand: '나이키', slug: 'zoom-fly-6', score: 88, upVotes: 178, downVotes: 38 },
      ],
      B: [
        { name: '킨바라 15', brand: '써코니', slug: 'kinvara-15', score: 85, upVotes: 145, downVotes: 42 },
        { name: '디비에이트 니트로 3', brand: '푸마', slug: 'deviate-nitro-3', score: 83, upVotes: 134, downVotes: 45 },
      ],
      C: [
        { name: '플로트라이드 에너지 5', brand: '리복', slug: 'floatride-energy-5', score: 72, upVotes: 89, downVotes: 78 },
        { name: '킵런 KS500', brand: '데카트론', slug: 'kiprun-ks500', score: 68, upVotes: 67, downVotes: 98 },
        { name: '에어로 버스트', brand: '스케쳐스', slug: 'aero-burst', score: 65, upVotes: 56, downVotes: 112 },
        { name: '르까프 러너', brand: '르까프', slug: 'lecoq-runner', score: 60, upVotes: 45, downVotes: 134 },
      ],
      D: [
        { name: '탑텐 러닝화', brand: '탑텐', slug: 'topten-running', score: 42, upVotes: 23, downVotes: 245 },
        { name: '노브랜드 러닝화', brand: '노브랜드', slug: 'nobrand-running', score: 35, upVotes: 15, downVotes: 289 },
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
      C: [
        { name: '후라이드', brand: '또래오래', slug: 'ttorae-fried', score: 72, upVotes: 134, downVotes: 112 },
        { name: '후라이드', brand: '가마치통닭', slug: 'gamachi-fried', score: 70, upVotes: 112, downVotes: 125 },
        { name: '후라이드', brand: '자담치킨', slug: 'jadam-fried', score: 68, upVotes: 98, downVotes: 134 },
        { name: '후라이드', brand: '피자나라치킨공주', slug: 'pizzanara-fried', score: 65, upVotes: 78, downVotes: 156 },
      ],
      D: [
        { name: '편의점 치킨', brand: 'CU/GS25', slug: 'convenience-fried', score: 42, upVotes: 34, downVotes: 245 },
        { name: '마트 치킨', brand: '이마트/홈플러스', slug: 'mart-fried', score: 38, upVotes: 45, downVotes: 267 },
        { name: '냉동 치킨', brand: '비비고/풀무원', slug: 'frozen-fried', score: 35, upVotes: 23, downVotes: 298 },
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
      C: [
        { name: '양념치킨', brand: '자담치킨', slug: 'jadam-yangnyum', score: 72, upVotes: 112, downVotes: 134 },
        { name: '양념치킨', brand: '가마치통닭', slug: 'gamachi-yangnyum', score: 70, upVotes: 98, downVotes: 145 },
        { name: '양념치킨', brand: '피자나라치킨공주', slug: 'pizzanara-yangnyum', score: 68, upVotes: 78, downVotes: 167 },
        { name: '양념치킨', brand: '땅땅치킨', slug: 'ddangddang-yangnyum', score: 65, upVotes: 67, downVotes: 178 },
      ],
      D: [
        { name: '양념 편의점 치킨', brand: 'CU/GS25', slug: 'convenience-yangnyum', score: 40, upVotes: 28, downVotes: 256 },
        { name: '양념 마트 치킨', brand: '이마트/홈플러스', slug: 'mart-yangnyum', score: 36, upVotes: 34, downVotes: 278 },
        { name: '양념 냉동 치킨', brand: '비비고/풀무원', score: 32, slug: 'frozen-yangnyum', upVotes: 18, downVotes: 312 },
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
      C: [
        { name: '간장치킨', brand: '노랑통닭', slug: 'norang-soy', score: 72, upVotes: 134, downVotes: 112 },
        { name: '허니간장', brand: '또래오래', slug: 'ttorae-honey', score: 70, upVotes: 112, downVotes: 134 },
        { name: '간장치킨', brand: '가마치통닭', slug: 'gamachi-soy', score: 68, upVotes: 89, downVotes: 145 },
        { name: '간장치킨', brand: '땅땅치킨', slug: 'ddangddang-soy', score: 65, upVotes: 67, downVotes: 167 },
      ],
      D: [
        { name: '간장 편의점 치킨', brand: 'CU/GS25', slug: 'convenience-soy', score: 38, upVotes: 23, downVotes: 267 },
        { name: '간장 마트 치킨', brand: '이마트/홈플러스', slug: 'mart-soy', score: 35, upVotes: 28, downVotes: 289 },
        { name: '냉동 간장치킨', brand: '비비고/풀무원', slug: 'frozen-soy', score: 30, upVotes: 15, downVotes: 312 },
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
      C: [
        { name: '양파치킨', brand: '노랑통닭', slug: 'norang-onion', score: 72, upVotes: 112, downVotes: 134 },
        { name: '마늘치킨', brand: '또래오래', slug: 'ttorae-garlic', score: 70, upVotes: 98, downVotes: 145 },
        { name: '시즈닝치킨', brand: '자담치킨', slug: 'jadam-seasoning', score: 68, upVotes: 78, downVotes: 156 },
        { name: '파우더치킨', brand: '가마치통닭', slug: 'gamachi-powder', score: 65, upVotes: 67, downVotes: 178 },
      ],
      D: [
        { name: '시즈닝 편의점 치킨', brand: 'CU/GS25', slug: 'convenience-powder', score: 40, upVotes: 23, downVotes: 267 },
        { name: '냉동 시즈닝치킨', brand: '비비고/풀무원', slug: 'frozen-powder', score: 35, upVotes: 18, downVotes: 289 },
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
      C: [
        { name: '숯불구이', brand: '지코바', slug: 'zicoba-charcoal', score: 74, upVotes: 145, downVotes: 112 },
        { name: '오븐구이', brand: '또래오래', slug: 'ttorae-oven', score: 70, upVotes: 112, downVotes: 134 },
        { name: '로스트치킨', brand: '자담치킨', slug: 'jadam-roast', score: 68, upVotes: 89, downVotes: 145 },
        { name: '오븐치킨', brand: '땅땅치킨', slug: 'ddangddang-oven', score: 65, upVotes: 67, downVotes: 167 },
      ],
      D: [
        { name: '마트 로티세리', brand: '코스트코/이마트', slug: 'mart-rotisserie', score: 45, upVotes: 56, downVotes: 234 },
        { name: '편의점 구이치킨', brand: 'CU/GS25', slug: 'convenience-roasted', score: 38, upVotes: 28, downVotes: 267 },
        { name: '냉동 오븐치킨', brand: '비비고/풀무원', slug: 'frozen-roasted', score: 32, upVotes: 18, downVotes: 298 },
      ],
    },
  },
  'mens-watch': {
    dress: {
      S: [
        { name: '파텍 필립 칼라트라바', brand: '파텍 필립', slug: 'patek-philippe', score: 99, upVotes: 345, downVotes: 5 },
        { name: '아 랑에 운트 죄네 삭소니아', brand: '아 랑에 운트 죄네', slug: 'a-lange-soehne', score: 98, upVotes: 312, downVotes: 8 },
        { name: '바쉐론 콘스탄틴 파트리모니', brand: '바쉐론 콘스탄틴', slug: 'vacheron-constantin', score: 97, upVotes: 298, downVotes: 10 },
      ],
      A: [
        { name: '예거 르쿨트르 마스터', brand: '예거 르쿨트르', slug: 'jaeger-lecoultre', score: 93, upVotes: 234, downVotes: 18 },
        { name: '블랑팡 빌르레', brand: '블랑팡', slug: 'blancpain', score: 91, upVotes: 198, downVotes: 22 },
      ],
      B: [
        { name: '오메가 드빌', brand: '오메가', slug: 'omega', score: 87, upVotes: 167, downVotes: 32 },
        { name: '까르띠에 탱크', brand: '까르띠에', slug: 'cartier', score: 86, upVotes: 156, downVotes: 35 },
        { name: '그랜드 세이코 엘레강스', brand: '그랜드 세이코', slug: 'grand-seiko', score: 84, upVotes: 145, downVotes: 38 },
      ],
      C: [
        { name: '론진 마스터 컬렉션', brand: '론진', slug: 'longines', score: 75, upVotes: 112, downVotes: 65 },
        { name: '노모스 탕고마트', brand: '노모스', slug: 'nomos', score: 73, upVotes: 98, downVotes: 72 },
      ],
      D: [
        { name: '티쏘 르 로끌', brand: '티쏘', slug: 'tissot', score: 64, upVotes: 78, downVotes: 98 },
        { name: '해밀턴 재즈마스터', brand: '해밀턴', slug: 'hamilton', score: 62, upVotes: 67, downVotes: 112 },
      ],
    },
    sport: {
      S: [
        { name: '오데마 피게 로열 오크', brand: '오데마 피게', slug: 'audemars-piguet', score: 98, upVotes: 456, downVotes: 12 },
        { name: '파텍 필립 노틸러스', brand: '파텍 필립', slug: 'patek-philippe', score: 97, upVotes: 423, downVotes: 15 },
      ],
      A: [
        { name: '롤렉스 서브마리너', brand: '롤렉스', slug: 'rolex', score: 95, upVotes: 567, downVotes: 22 },
        { name: '블랑팡 피프티 패덤스', brand: '블랑팡', slug: 'blancpain', score: 92, upVotes: 289, downVotes: 28 },
      ],
      B: [
        { name: '오메가 씨마스터', brand: '오메가', slug: 'omega', score: 88, upVotes: 345, downVotes: 42 },
        { name: 'IWC 아쿠아타이머', brand: 'IWC', slug: 'iwc', score: 85, upVotes: 198, downVotes: 48 },
        { name: '파네라이 서브머시블', brand: '파네라이', slug: 'panerai', score: 84, upVotes: 178, downVotes: 52 },
      ],
      C: [
        { name: '튜더 블랙베이', brand: '튜더', slug: 'tudor', score: 77, upVotes: 234, downVotes: 78 },
        { name: '태그호이어 아쿠아레이서', brand: '태그호이어', slug: 'tag-heuer', score: 76, upVotes: 198, downVotes: 85 },
        { name: '브라이틀링 슈퍼오션', brand: '브라이틀링', slug: 'breitling', score: 75, upVotes: 178, downVotes: 89 },
      ],
      D: [
        { name: '세이코 프로스펙스', brand: '세이코', slug: 'seiko', score: 63, upVotes: 134, downVotes: 112 },
        { name: '카시오 지샥', brand: '카시오', slug: 'casio-gshock', score: 60, upVotes: 156, downVotes: 134 },
      ],
    },
    daily: {
      S: [
        { name: '롤렉스 데이트저스트', brand: '롤렉스', slug: 'rolex', score: 96, upVotes: 678, downVotes: 25 },
        { name: '오메가 스피드마스터', brand: '오메가', slug: 'omega', score: 94, upVotes: 523, downVotes: 32 },
      ],
      A: [
        { name: '까르띠에 산토스', brand: '까르띠에', slug: 'cartier', score: 90, upVotes: 345, downVotes: 42 },
        { name: 'IWC 포르투기저', brand: 'IWC', slug: 'iwc', score: 88, upVotes: 267, downVotes: 48 },
        { name: '그랜드 세이코 헤리티지', brand: '그랜드 세이코', slug: 'grand-seiko', score: 86, upVotes: 234, downVotes: 52 },
      ],
      B: [
        { name: '튜더 블랙베이 58', brand: '튜더', slug: 'tudor', score: 82, upVotes: 298, downVotes: 72 },
        { name: '태그호이어 카레라', brand: '태그호이어', slug: 'tag-heuer', score: 80, upVotes: 234, downVotes: 78 },
        { name: '론진 스피릿', brand: '론진', slug: 'longines', score: 78, upVotes: 198, downVotes: 85 },
      ],
      C: [
        { name: '티쏘 PRX', brand: '티쏘', slug: 'tissot', score: 72, upVotes: 312, downVotes: 112 },
        { name: '해밀턴 카키필드', brand: '해밀턴', slug: 'hamilton', score: 70, upVotes: 267, downVotes: 125 },
        { name: '세이코 프레사지', brand: '세이코', slug: 'seiko', score: 68, upVotes: 234, downVotes: 134 },
      ],
      D: [
        { name: '카시오 지샥', brand: '카시오', slug: 'casio-gshock', score: 60, upVotes: 345, downVotes: 178 },
        { name: '애플워치', brand: '애플', slug: 'smartwatch', score: 55, upVotes: 456, downVotes: 234 },
      ],
    },
    investment: {
      S: [
        { name: '파텍 필립 노틸러스', brand: '파텍 필립', slug: 'patek-philippe', score: 99, upVotes: 567, downVotes: 8 },
        { name: '롤렉스 데이토나', brand: '롤렉스', slug: 'rolex', score: 98, upVotes: 623, downVotes: 12 },
        { name: '오데마 피게 로열 오크', brand: '오데마 피게', slug: 'audemars-piguet', score: 97, upVotes: 489, downVotes: 15 },
      ],
      A: [
        { name: '바쉐론 콘스탄틴 오버시즈', brand: '바쉐론 콘스탄틴', slug: 'vacheron-constantin', score: 93, upVotes: 312, downVotes: 22 },
        { name: '롤렉스 서브마리너', brand: '롤렉스', slug: 'rolex', score: 92, upVotes: 478, downVotes: 28 },
      ],
      B: [
        { name: '오메가 스피드마스터 문워치', brand: '오메가', slug: 'omega', score: 85, upVotes: 234, downVotes: 52 },
        { name: '까르띠에 산토스', brand: '까르띠에', slug: 'cartier', score: 83, upVotes: 198, downVotes: 58 },
      ],
      C: [
        { name: '튜더 블랙베이', brand: '튜더', slug: 'tudor', score: 72, upVotes: 145, downVotes: 98 },
        { name: '그랜드 세이코', brand: '그랜드 세이코', slug: 'grand-seiko', score: 68, upVotes: 112, downVotes: 112 },
      ],
      D: [
        { name: '태그호이어', brand: '태그호이어', slug: 'tag-heuer', score: 55, upVotes: 67, downVotes: 178 },
        { name: '티쏘', brand: '티쏘', slug: 'tissot', score: 45, upVotes: 45, downVotes: 234 },
        { name: '스마트워치', brand: '애플/삼성', slug: 'smartwatch', score: 20, upVotes: 12, downVotes: 345 },
      ],
    },
  },
};

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
    { name: '롤렉스', brand: '롤렉스', tier: 'A', change: '+22.3', slug: 'rolex' },
    { name: '오데마 피게', brand: '오데마 피게', tier: 'S', change: '+15.8', slug: 'audemars-piguet' },
    { name: '오메가', brand: '오메가', tier: 'B', change: '+12.1', slug: 'omega' },
    { name: '튜더', brand: '튜더', tier: 'C', change: '+9.7', slug: 'tudor' },
    { name: '그랜드 세이코', brand: '그랜드 세이코', tier: 'B', change: '+8.4', slug: 'grand-seiko' },
    { name: '티쏘', brand: '티쏘', tier: 'D', change: '+7.2', slug: 'tissot' },
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
                      {(['S', 'A', 'B', 'C', 'D'] as TierLevel[]).map((tier) => {
                        const items = usageTiers[tier] || [];
                        const tierColors: Record<TierLevel, string> = {
                          S: '#FFD700',  // 황제 - Gold
                          A: '#9370DB',  // 왕 - Purple
                          B: '#4169E1',  // 양반 - Royal Blue
                          C: '#3CB371',  // 중인 - Green
                          D: '#8B7355',  // 평민 - Brown
                        };
                        const tierLabels: Record<TierLevel, string> = {
                          S: '황제',
                          A: '왕',
                          B: '양반',
                          C: '중인',
                          D: '평민',
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
