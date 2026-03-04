'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategory } from '@/hooks/useBrands';
import { useQuizStore } from '@/store/quizStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import { Share2, Link2, RotateCcw, ChevronLeft, Users, Trophy, Check } from 'lucide-react';
import { CHICKEN_MENUS, CHICKEN_RECOMMENDATIONS } from '@/lib/mockData';
import type { TierLevel } from '@/lib/tier';

interface QuizContentProps {
  category: string;
}

// 러닝화 기본 질문
const RUNNING_SHOES_QUESTIONS = [
  {
    key: 'budget',
    question: '예산은 어느 정도인가요?',
    emoji: '💰',
    options: [
      { value: 'low', label: '10만원 이하', description: '가성비 중시' },
      { value: 'mid', label: '10-20만원', description: '적당한 투자' },
      { value: 'high', label: '20만원 이상', description: '최고급 제품' },
    ],
  },
  {
    key: 'usage',
    question: '주로 어떤 용도로 사용하시나요?',
    emoji: '🏃',
    options: [
      { value: 'beginner', label: '입문/취미', description: '가볍게 달리기' },
      { value: 'daily', label: '일상 훈련', description: '꾸준한 러닝' },
      { value: 'race', label: '대회/레이스', description: '기록 도전' },
    ],
  },
  {
    key: 'foot_type',
    question: '발 모양은 어떤가요?',
    emoji: '🦶',
    options: [
      { value: 'flat', label: '평발', description: '아치가 낮음' },
      { value: 'normal', label: '보통', description: '일반적인 아치' },
      { value: 'high', label: '요족', description: '아치가 높음' },
    ],
  },
  {
    key: 'priority',
    question: '가장 중요하게 생각하는 것은?',
    emoji: '⭐',
    options: [
      { value: 'cushion', label: '쿠셔닝', description: '편안함 우선' },
      { value: 'speed', label: '경량성', description: '빠른 속도' },
      { value: 'stability', label: '안정성', description: '부상 방지' },
    ],
  },
];

// 카테고리별 설정
const CATEGORY_CONFIG: Record<string, {
  title: string;
  resultTitle: string;
  userLabel: string;
  repurchaseLabel: string;
}> = {
  'running-shoes': {
    title: '나에게 맞는 러닝화 찾기',
    resultTitle: '추천 러닝화',
    userLabel: '러너',
    repurchaseLabel: '재구매',
  },
  'chicken': {
    title: '나에게 맞는 치킨 찾기',
    resultTitle: '추천 치킨',
    userLabel: '치킨러버',
    repurchaseLabel: '재주문',
  },
};

interface Recommendation {
  id: number;
  name: string;
  brand: string;
  tier: TierLevel;
  score: number;
  match: number;
  slug: string;
  reason: string;
  similarUsers: number;
}

// 러닝화 기본 추천
const RUNNING_SHOES_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    name: '노바블라스트 5',
    brand: '아식스',
    tier: 'A',
    score: 83,
    match: 95,
    slug: 'novablast-5',
    reason: '쿠셔닝과 반발력의 완벽한 조화',
    similarUsers: 234,
  },
  {
    id: 2,
    name: '클리프톤 10',
    brand: '호카',
    tier: 'A',
    score: 81,
    match: 88,
    slug: 'clifton-10',
    reason: '뛰어난 쿠셔닝, 가벼운 무게',
    similarUsers: 189,
  },
  {
    id: 3,
    name: '페가수스 41',
    brand: '나이키',
    tier: 'B',
    score: 78,
    match: 82,
    slug: 'pegasus-41',
    reason: '검증된 성능, 합리적 가격',
    similarUsers: 156,
  },
];

// 치킨 추천 결과 생성 함수
function getChickenRecommendations(answers: Record<string, string>): Recommendation[] {
  // 답변 조합으로 추천 키 생성
  const key = `${answers.flavor}_${answers.occasion}_${answers.drink}`;
  const recommendations = CHICKEN_RECOMMENDATIONS[key as keyof typeof CHICKEN_RECOMMENDATIONS]
    || CHICKEN_RECOMMENDATIONS['default'];

  return recommendations.map((rec, index) => {
    const menu = CHICKEN_MENUS.find(m => m.slug === rec.slug);
    return {
      id: index + 1,
      name: rec.name,
      brand: rec.brand,
      tier: menu?.tier || 'A' as TierLevel,
      score: menu?.tier_score || 85,
      match: rec.match,
      slug: rec.slug,
      reason: rec.reason,
      similarUsers: Math.floor(Math.random() * 200) + 100,
    };
  });
}

export function QuizContent({ category }: QuizContentProps) {
  const { data: categoryData, isLoading } = useCategory(category);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1);

  const { setQuizData } = useQuizStore();

  // 카테고리별 설정
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['running-shoes'];

  const questions = useMemo(() => {
    if (categoryData?.quiz_definitions && categoryData.quiz_definitions.length > 0) {
      return categoryData.quiz_definitions;
    }
    // 카테고리별 기본 질문
    return category === 'chicken' ? [] : RUNNING_SHOES_QUESTIONS;
  }, [categoryData, category]);

  // 카테고리별 추천 결과
  const recommendations = useMemo(() => {
    if (category === 'chicken') {
      return getChickenRecommendations(answers);
    }
    return RUNNING_SHOES_RECOMMENDATIONS;
  }, [category, answers]);

  const handleAnswer = (questionKey: string, value: string) => {
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentStep(currentStep + 1), 200);
    } else {
      setQuizData({
        category,
        ...newAnswers,
      });
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
    setDirection(1);
  };

  const handleShare = async (type: 'kakao' | 'link') => {
    if (type === 'link') {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">퀴즈를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;
  const categoryName = categoryData?.name || '제품';

  // Result Screen
  if (isComplete) {
    const totalSimilarUsers = recommendations.reduce((sum, r) => sum + r.similarUsers, 0);

    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">분석 완료!</h1>
            <p className="text-muted-foreground">
              <span className="font-semibold text-accent">{totalSimilarUsers}명</span>의 비슷한 {config.userLabel} 데이터를 분석했습니다
            </p>
          </div>

          {/* TOP 3 Recommendations */}
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            {config.resultTitle} TOP 3
          </h2>

          <div className="space-y-4 mb-8">
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link href={`/${category}/model/${product.slug}`}>
                  <Card className="card-base overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Rank Badge */}
                        <div
                          className={`w-16 flex items-center justify-center shrink-0 ${
                            index === 0
                              ? 'bg-gradient-to-br from-amber-400 to-amber-500'
                              : index === 1
                                ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                                : 'bg-gradient-to-br from-amber-600 to-amber-700'
                          }`}
                        >
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{product.brand} {product.name}</span>
                                <TierBadge tier={product.tier} size="sm" showLabel={false} />
                              </div>
                              <p className="text-sm text-muted-foreground">{product.reason}</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 shrink-0">
                              {product.match}% 매칭
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>비슷한 조건 {product.similarUsers}명 선택</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Repurchase Stats */}
          <Card className="card-base gradient-primary text-white mb-8">
            <CardContent className="py-6 text-center">
              <p className="text-sm opacity-80 mb-2">나와 비슷한 조건의 {config.userLabel} 중</p>
              <p className="text-5xl font-bold mb-2">73%</p>
              <p className="opacity-80">가 1위 제품을 {config.repurchaseLabel}했습니다</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
              <Link href={`/${category}/model/${recommendations[0]?.slug}`}>
                1위 제품 자세히 보기
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/${category}/tier`}>전체 계급도 보기</Link>
            </Button>
          </div>

          {/* Share & Reset */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => handleShare('kakao')}>
              <Share2 className="h-4 w-4 mr-2" />
              카카오톡
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleShare('link')}>
              <Link2 className="h-4 w-4 mr-2" />
              링크 복사
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              다시 테스트
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  // Quiz Screen
  return (
    <div className="container py-8 max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {questions.length}
            </span>
          </div>
          <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="card-base mb-8">
            <CardContent className="py-8 text-center">
              <span className="text-5xl mb-4 block">{currentQuestion.emoji || '❓'}</span>
              <h1 className="text-2xl font-bold">{currentQuestion.question}</h1>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(currentQuestion.key, option.value)}
                className={`
                  w-full p-5 rounded-2xl border-2 text-left transition-all
                  ${answers[currentQuestion.key] === option.value
                    ? 'border-accent bg-accent/5 shadow-md'
                    : 'border-border hover:border-accent/50 hover:shadow-sm'
                  }
                `}
              >
                <p className="font-semibold text-lg">{option.label}</p>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
