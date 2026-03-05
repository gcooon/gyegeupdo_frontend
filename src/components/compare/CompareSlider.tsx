'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TierBadge } from '@/components/tier/TierBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, ArrowLeftRight, Check, X, Minus } from 'lucide-react';
import type { TierLevel } from '@/lib/tier';

interface CompareItem {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  tier: TierLevel;
  tierScore: number;
  specs?: Array<{
    key: string;
    label: string;
    value: string;
    unit?: string;
  }>;
  scores?: Array<{
    key: string;
    label: string;
    value: number;
  }>;
  pros?: string[];
  cons?: string[];
}

interface CompareSliderProps {
  leftItem: CompareItem;
  rightItem: CompareItem;
}

export function CompareSlider({ leftItem, rightItem }: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  // 스펙 비교 (공통 키 기준)
  const compareSpecs = () => {
    if (!leftItem.specs || !rightItem.specs) return [];

    const leftSpecMap = new Map(leftItem.specs.map((s) => [s.key, s]));
    const rightSpecMap = new Map(rightItem.specs.map((s) => [s.key, s]));

    const allKeys = [...new Set([...leftSpecMap.keys(), ...rightSpecMap.keys()])];

    return allKeys.map((key) => ({
      key,
      label: leftSpecMap.get(key)?.label || rightSpecMap.get(key)?.label || key,
      left: leftSpecMap.get(key),
      right: rightSpecMap.get(key),
    }));
  };

  // 점수 비교
  const compareScores = () => {
    if (!leftItem.scores || !rightItem.scores) return [];

    const leftScoreMap = new Map(leftItem.scores.map((s) => [s.key, s]));
    const rightScoreMap = new Map(rightItem.scores.map((s) => [s.key, s]));

    const allKeys = [...new Set([...leftScoreMap.keys(), ...rightScoreMap.keys()])];

    return allKeys.map((key) => ({
      key,
      label: leftScoreMap.get(key)?.label || rightScoreMap.get(key)?.label || key,
      left: leftScoreMap.get(key)?.value || 0,
      right: rightScoreMap.get(key)?.value || 0,
    }));
  };

  return (
    <div className="space-y-6">
      {/* 이미지 비교 슬라이더 */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            슬라이더를 움직여 비교해보세요
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={containerRef}
            className="relative h-64 md:h-80 cursor-ew-resize select-none overflow-hidden"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            {/* 왼쪽 제품 (전체 너비로 깔림) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <div className="text-center p-4">
                {leftItem.imageUrl ? (
                  <Image
                    src={leftItem.imageUrl}
                    alt={leftItem.name}
                    width={200}
                    height={200}
                    className="object-contain mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-muted-foreground">{leftItem.brand[0]}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-center gap-2">
                  <TierBadge tier={leftItem.tier} size="sm" showLabel={false} />
                  <span className="font-bold">{leftItem.tierScore.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{leftItem.brand}</p>
                <p className="font-semibold">{leftItem.name}</p>
              </div>
            </div>

            {/* 오른쪽 제품 (클리핑됨) */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
              }}
            >
              <div className="text-center p-4">
                {rightItem.imageUrl ? (
                  <Image
                    src={rightItem.imageUrl}
                    alt={rightItem.name}
                    width={200}
                    height={200}
                    className="object-contain mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-muted-foreground">{rightItem.brand[0]}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-center gap-2">
                  <TierBadge tier={rightItem.tier} size="sm" showLabel={false} />
                  <span className="font-bold">{rightItem.tierScore.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rightItem.brand}</p>
                <p className="font-semibold">{rightItem.name}</p>
              </div>
            </div>

            {/* 슬라이더 핸들 */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%` }}
              initial={false}
              animate={{ x: '-50%' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <GripVertical className="h-5 w-5 text-white" />
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* 스펙 비교 테이블 */}
      {(leftItem.specs || rightItem.specs) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">스펙 비교</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {compareSpecs().map((spec) => (
                <div
                  key={spec.key}
                  className="grid grid-cols-3 gap-2 text-sm py-2 border-b last:border-0"
                >
                  <div className="text-right font-medium">
                    {spec.left ? `${spec.left.value}${spec.left.unit || ''}` : '-'}
                  </div>
                  <div className="text-center text-muted-foreground text-xs">
                    {spec.label}
                  </div>
                  <div className="text-left font-medium">
                    {spec.right ? `${spec.right.value}${spec.right.unit || ''}` : '-'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 점수 비교 바 */}
      {(leftItem.scores || rightItem.scores) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">성능 비교</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {compareScores().map((score) => {
              const leftWins = score.left > score.right;
              const rightWins = score.right > score.left;
              const tie = score.left === score.right;

              return (
                <div key={score.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={leftWins ? 'font-bold text-accent' : ''}>
                      {score.left}
                    </span>
                    <span className="text-muted-foreground text-xs">{score.label}</span>
                    <span className={rightWins ? 'font-bold text-accent' : ''}>
                      {score.right}
                    </span>
                  </div>
                  <div className="flex h-2 gap-1">
                    <div
                      className={`rounded-l transition-all ${leftWins ? 'bg-accent' : 'bg-muted'}`}
                      style={{ width: `${score.left}%` }}
                    />
                    <div
                      className={`rounded-r transition-all ${rightWins ? 'bg-blue-500' : 'bg-muted'}`}
                      style={{ width: `${score.right}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* 장단점 비교 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 왼쪽 제품 장단점 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TierBadge tier={leftItem.tier} size="sm" showLabel={false} />
              {leftItem.brand} {leftItem.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {leftItem.pros && leftItem.pros.length > 0 && (
              <div>
                <p className="text-xs text-emerald-600 font-medium mb-1">장점</p>
                <div className="flex flex-wrap gap-1">
                  {leftItem.pros.map((pro, idx) => (
                    <Badge key={idx} variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 text-xs">
                      <Check className="h-3 w-3 mr-1" />{pro}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {leftItem.cons && leftItem.cons.length > 0 && (
              <div>
                <p className="text-xs text-red-600 font-medium mb-1">단점</p>
                <div className="flex flex-wrap gap-1">
                  {leftItem.cons.map((con, idx) => (
                    <Badge key={idx} variant="outline" className="text-red-600 border-red-300 bg-red-50 text-xs">
                      <X className="h-3 w-3 mr-1" />{con}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 오른쪽 제품 장단점 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TierBadge tier={rightItem.tier} size="sm" showLabel={false} />
              {rightItem.brand} {rightItem.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {rightItem.pros && rightItem.pros.length > 0 && (
              <div>
                <p className="text-xs text-emerald-600 font-medium mb-1">장점</p>
                <div className="flex flex-wrap gap-1">
                  {rightItem.pros.map((pro, idx) => (
                    <Badge key={idx} variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 text-xs">
                      <Check className="h-3 w-3 mr-1" />{pro}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {rightItem.cons && rightItem.cons.length > 0 && (
              <div>
                <p className="text-xs text-red-600 font-medium mb-1">단점</p>
                <div className="flex flex-wrap gap-1">
                  {rightItem.cons.map((con, idx) => (
                    <Badge key={idx} variant="outline" className="text-red-600 border-red-300 bg-red-50 text-xs">
                      <X className="h-3 w-3 mr-1" />{con}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
