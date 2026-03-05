'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TierBadge } from '@/components/tier/TierBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/effects/Confetti';
import { useGamificationStore } from '@/store/gamificationStore';
import { POINT_ACTIONS } from '@/types/gamification';
import {
  Heart,
  X,
  Star,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import type { TierLevel } from '@/lib/tier';

interface SwipeItem {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  tier: TierLevel;
  tierScore: number;
  description?: string;
  slug: string;
}

interface SwipeCardProps {
  items: SwipeItem[];
  category: string;
  onComplete?: (liked: SwipeItem[], passed: SwipeItem[]) => void;
}

export function SwipeCard({ items, category, onComplete }: SwipeCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<SwipeItem[]>([]);
  const [passedItems, setPassedItems] = useState<SwipeItem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const { addPoints, incrementStat } = useGamificationStore();

  const currentItem = items[currentIndex];
  const progress = ((currentIndex) / items.length) * 100;
  const remainingCount = items.length - currentIndex;

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    if (!currentItem) return;

    setDirection(swipeDirection);

    if (swipeDirection === 'right') {
      setLikedItems((prev) => [...prev, currentItem]);
    } else {
      setPassedItems((prev) => [...prev, currentItem]);
    }

    setTimeout(() => {
      if (currentIndex >= items.length - 1) {
        setShowResult(true);
        setShowConfetti(true);
        onComplete?.(likedItems, passedItems);

        // Gamification: 디스커버리 완료 포인트
        addPoints(POINT_ACTIONS.vote);
        incrementStat('visits');
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      setDirection(null);
    }, 200);
  };

  const handleUndo = () => {
    if (currentIndex === 0) return;

    const prevIndex = currentIndex - 1;
    const prevItem = items[prevIndex];

    // 이전 항목이 어디에 있었는지 확인하고 제거
    setLikedItems((prev) => prev.filter((item) => item.id !== prevItem.id));
    setPassedItems((prev) => prev.filter((item) => item.id !== prevItem.id));
    setCurrentIndex(prevIndex);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedItems([]);
    setPassedItems([]);
    setShowResult(false);
  };

  // 결과 화면
  if (showResult) {
    return (
      <>
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
            >
              <Heart className="h-10 w-10 text-white fill-white" />
            </motion.div>
            <h2 className="text-2xl font-bold">완료!</h2>
            <p className="text-muted-foreground">
              {likedItems.length}개의 제품을 좋아요 했어요
            </p>
          </div>

          {/* 좋아요한 항목 */}
          {likedItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-left flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                내 위시리스트
              </h3>
              <div className="grid gap-2">
                {likedItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/${category}/model/${item.slug}`}>
                      <Card className="hover:border-accent transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">
                                {item.name[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                            <p className="font-medium truncate">{item.name}</p>
                          </div>
                          <TierBadge tier={item.tier} size="sm" showLabel={false} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              다시하기
            </Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90" asChild>
              <Link href={`/${category}/tier`}>계급도 보기</Link>
            </Button>
          </div>
        </motion.div>
      </>
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 진행 상황 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>남은 항목: {remainingCount}개</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 카드 스택 */}
      <div className="relative h-[400px] md:h-[450px]">
        {/* 배경 카드들 */}
        {items.slice(currentIndex + 1, currentIndex + 3).map((item, idx) => (
          <div
            key={item.id}
            className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 border"
            style={{
              transform: `scale(${0.95 - idx * 0.05}) translateY(${(idx + 1) * 8}px)`,
              opacity: 0.5 - idx * 0.2,
              zIndex: -idx - 1,
            }}
          />
        ))}

        {/* 메인 카드 */}
        <AnimatePresence mode="wait">
          <SwipeableCard
            key={currentItem.id}
            item={currentItem}
            direction={direction}
            onSwipe={handleSwipe}
            category={category}
          />
        </AnimatePresence>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handleUndo}
          disabled={currentIndex === 0}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-500"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-8 w-8 text-red-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-500"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-8 w-8 text-pink-500" />
        </Button>

        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
          <Star className="h-5 w-5 text-amber-500" />
        </Button>
      </div>

      {/* 힌트 */}
      <p className="text-center text-sm text-muted-foreground">
        좌우로 스와이프하거나 버튼을 눌러주세요
      </p>
    </div>
  );
}

// 스와이프 가능한 개별 카드
interface SwipeableCardProps {
  item: SwipeItem;
  direction: 'left' | 'right' | null;
  onSwipe: (direction: 'left' | 'right') => void;
  category: string;
}

function SwipeableCard({ item, direction, onSwipe, category }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // 스와이프 인디케이터 opacity
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  const exitDirection = direction === 'left' ? -300 : direction === 'right' ? 300 : 0;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{
        x: exitDirection,
        opacity: 0,
        rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="h-full overflow-hidden border-2">
        {/* 이미지 영역 */}
        <div className="relative h-3/5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl text-muted-foreground/30">{item.brand[0]}</span>
            </div>
          )}

          {/* 티어 뱃지 */}
          <div className="absolute top-4 left-4">
            <TierBadge tier={item.tier} size="lg" animated />
          </div>

          {/* LIKE 인디케이터 */}
          <motion.div
            className="absolute top-4 right-4 px-4 py-2 bg-pink-500 text-white rounded-lg font-bold text-xl transform rotate-12"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>

          {/* NOPE 인디케이터 */}
          <motion.div
            className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-xl transform -rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </motion.div>
        </div>

        {/* 정보 영역 */}
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{item.brand}</p>
              <h3 className="text-xl font-bold">{item.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">{item.tierScore.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">점</p>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          )}

          <Link
            href={`/${category}/model/${item.slug}`}
            className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            상세보기 <ChevronRight className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
