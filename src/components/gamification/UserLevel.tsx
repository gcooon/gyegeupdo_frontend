'use client';

import { useGamificationStore } from '@/store/gamificationStore';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface UserLevelProps {
  variant?: 'full' | 'compact' | 'minimal';
  showProgress?: boolean;
}

export function UserLevel({ variant = 'full', showProgress = true }: UserLevelProps) {
  const { points, getCurrentLevel, getProgressToNextLevel } = useGamificationStore();

  const currentLevel = getCurrentLevel();
  const progress = getProgressToNextLevel();
  const nextLevelPoints = currentLevel.maxPoints === Infinity
    ? null
    : currentLevel.maxPoints - points;

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{currentLevel.emoji}</span>
        <span className="text-sm font-medium">Lv.{currentLevel.level}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: `${currentLevel.color}20` }}
        >
          {currentLevel.emoji}
        </div>
        <div>
          <p className="text-sm font-medium leading-tight">Lv.{currentLevel.level}</p>
          <p className="text-xs text-muted-foreground">{currentLevel.name}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* 레벨 아이콘 */}
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-inner"
            style={{ backgroundColor: `${currentLevel.color}20` }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            {currentLevel.emoji}
          </motion.div>

          {/* 레벨 정보 */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-sm text-muted-foreground">Lv.</span>
                <span className="text-xl font-bold">{currentLevel.level}</span>
                <span className="text-sm font-medium ml-2">{currentLevel.name}</span>
              </div>
              <span className="text-sm font-medium">{points.toLocaleString()} P</span>
            </div>

            {showProgress && (
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                {nextLevelPoints !== null && (
                  <p className="text-xs text-muted-foreground text-right">
                    다음 레벨까지 {nextLevelPoints.toLocaleString()}P
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
