'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategory } from '@/hooks/useBrands';
import { useQuizStore } from '@/store/quizStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/tier/TierBadge';
import { Confetti } from '@/components/effects/Confetti';
import { RotateCcw, ChevronLeft, Users, Trophy, Check, Loader2 } from 'lucide-react';
import { ShareButtons } from '@/components/share/ShareButtons';
import { POINT_ACTIONS } from '@/types/gamification';
import type { TierLevel } from '@/lib/tier';
import api from '@/lib/api';

interface QuizContentProps {
  category: string;
}

// 카테고리별 설정 (카테고리 데이터에서 동적으로 생성)
function getQuizConfig(categoryData: import('@/types/model').Category | undefined) {
  const name = categoryData?.name || '제품';
  return {
    title: `나에게 맞는 ${name} 찾기`,
    resultTitle: `추천 ${name}`,
    userLabel: name === '러닝화' ? '러너' : name === '치킨' ? '치킨러버' : name === '남자시계' ? '시계러' : '사용자',
    repurchaseLabel: name === '치킨' ? '재주문' : '재구매',
  };
}

interface ApiRecommendation {
  rank: number;
  product: {
    id: number;
    name: string;
    slug: string;
    tier: TierLevel;
    tier_score: number;
    brand_name: string;
    brand_slug: string;
    image_url: string;
    usage: string;
    product_type: string;
  };
  match_score: number;
  reasons: string[];
  similar_user_count: number;
}

interface QuizApiResponse {
  session_key: string;
  category: {
    slug: string;
    name: string;
    icon: string;
  };
  recommendations: ApiRecommendation[];
  share_url: string;
}

export function QuizContent({ category }: QuizContentProps) {
  const { data: categoryData, isLoading } = useCategory(category);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [apiResult, setApiResult] = useState<QuizApiResponse | null>(null);

  const { setQuizData } = useQuizStore();
  const { addPoints, incrementStat } = useGamificationStore();

  // 카테고리별 설정 (API 데이터 기반)
  const config = useMemo(() => getQuizConfig(categoryData), [categoryData]);

  const questions = useMemo(() => {
    if (categoryData?.quiz_definitions && categoryData.quiz_definitions.length > 0) {
      return categoryData.quiz_definitions;
    }
    return [];
  }, [categoryData]);

  const handleAnswer = async (questionKey: string, value: string) => {
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentStep(currentStep + 1), 200);
    } else {
      // 마지막 질문 - API 호출
      setIsSubmitting(true);
      try {
        const response = await api.post<{ success: boolean; data: QuizApiResponse }>('/quiz/', {
          category,
          answers: newAnswers,
        });

        if (response.data.success) {
          setApiResult(response.data.data);
          setQuizData({
            category,
            ...newAnswers,
          });
          setIsComplete(true);
          setShowConfetti(true);

          // Gamification
          addPoints(POINT_ACTIONS.complete_quiz);
          incrementStat('quizzes');
        }
      } catch {
        // 에러 시에도 결과 화면 표시 (빈 추천)
        setIsComplete(true);
      } finally {
        setIsSubmitting(false);
      }
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
    setApiResult(null);
    setDirection(1);
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

  if (questions.length === 0) {
    return (
      <div className="container py-8 max-w-xl mx-auto text-center">
        <Card className="card-base">
          <CardContent className="py-12">
            <span className="text-5xl mb-4 block">🚧</span>
            <h1 className="text-2xl font-bold mb-2">퀴즈 준비 중</h1>
            <p className="text-muted-foreground mb-6">
              {categoryData?.name || '이 카테고리'}의 퀴즈가 곧 준비됩니다.
            </p>
            <Button asChild>
              <Link href={`/${category}/tier`}>계급도 보기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentStep + 1) / questions.length) * 100;
  const categoryName = categoryData?.name || '제품';

  // Submitting Screen
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-lg font-medium">분석 중...</p>
          <p className="text-muted-foreground">나에게 맞는 {categoryName}를 찾고 있어요</p>
        </div>
      </div>
    );
  }

  // Result Screen
  if (isComplete) {
    const recommendations = apiResult?.recommendations || [];
    const totalSimilarUsers = recommendations.reduce((sum, r) => sum + r.similar_user_count, 0);

    return (
      <div className="container py-8 max-w-2xl mx-auto">
        {/* Confetti Effect */}
        <Confetti
          isActive={showConfetti}
          duration={4000}
          particleCount={60}
          onComplete={() => setShowConfetti(false)}
        />

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
          {recommendations.length > 0 ? (
            <>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                {config.resultTitle} TOP 3
              </h2>

              <div className="space-y-4 mb-8">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Link href={`/${category}/model/${rec.product.slug}`}>
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
                                    <span className="font-semibold">{rec.product.brand_name} {rec.product.name}</span>
                                    <TierBadge tier={rec.product.tier} size="sm" showLabel={false} />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {rec.reasons.join(' · ')}
                                  </p>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-700 shrink-0">
                                  {rec.match_score}% 매칭
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>비슷한 조건 {rec.similar_user_count}명 선택</span>
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
                  <Link href={`/${category}/model/${recommendations[0]?.product.slug}`}>
                    1위 제품 자세히 보기
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/${category}/tier`}>전체 계급도 보기</Link>
                </Button>
              </div>
            </>
          ) : (
            <Card className="card-base mb-8">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  조건에 맞는 추천 제품을 찾지 못했습니다.
                </p>
                <Button asChild>
                  <Link href={`/${category}/tier`}>전체 계급도 보기</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Share & Reset */}
          <div className="flex flex-col items-center gap-4">
            <ShareButtons
              title={`${config.resultTitle} 퀴즈 결과 - 티어차트 계급도`}
              description={`나에게 맞는 ${categoryName} TOP 3를 확인해보세요!`}
              variant="full"
            />
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
            {currentQuestion.options.map((option: { value: string; label: string; description?: string }, index: number) => (
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
