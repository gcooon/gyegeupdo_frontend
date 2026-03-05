'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/store/gamificationStore';
import { BADGES, RARITY_COLORS, Badge } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, Lock, Sparkles } from 'lucide-react';

interface BadgeGridProps {
  showLocked?: boolean;
  category?: 'activity' | 'achievement' | 'special' | 'all';
}

export function BadgeGrid({ showLocked = true, category = 'all' }: BadgeGridProps) {
  const { earnedBadges, hasEarnedBadge, stats, level } = useGamificationStore();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = category === 'all'
    ? BADGES
    : BADGES.filter((b) => b.category === category);

  // 획득한 뱃지 먼저, 그 다음 미획득 뱃지
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const aEarned = hasEarnedBadge(a.id);
    const bEarned = hasEarnedBadge(b.id);
    if (aEarned && !bEarned) return -1;
    if (!aEarned && bEarned) return 1;
    return 0;
  });

  // 진행률 계산
  const getProgress = (badge: Badge): number => {
    let current = 0;
    let target = badge.requirement.value;

    switch (badge.requirement.type) {
      case 'reviews':
        current = stats.reviews;
        break;
      case 'votes':
        current = stats.votes;
        break;
      case 'visits':
        current = stats.visits;
        break;
      case 'tier_makers':
        current = stats.tierMakers;
        break;
      case 'quizzes':
        current = stats.quizzes;
        break;
      case 'streak':
        current = stats.streak;
        break;
      case 'level':
        current = level;
        break;
    }

    return Math.min(100, (current / target) * 100);
  };

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {sortedBadges.map((badge) => {
          const earned = hasEarnedBadge(badge.id);
          const progress = getProgress(badge);
          const rarityStyle = RARITY_COLORS[badge.rarity];

          if (!earned && !showLocked) return null;

          return (
            <motion.button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`
                relative aspect-square rounded-xl flex flex-col items-center justify-center p-2
                border-2 transition-all
                ${earned
                  ? `${rarityStyle.bg} ${rarityStyle.border} hover:scale-105`
                  : 'bg-muted/30 border-dashed border-muted-foreground/30 opacity-50'
                }
              `}
              whileHover={{ scale: earned ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 뱃지 이모지 */}
              <span className={`text-2xl md:text-3xl ${!earned && 'grayscale'}`}>
                {badge.emoji}
              </span>

              {/* 잠금 아이콘 */}
              {!earned && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              {/* 진행률 (미획득 뱃지) */}
              {!earned && progress > 0 && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* 희귀도 표시 (획득 뱃지) */}
              {earned && badge.rarity !== 'common' && (
                <Sparkles
                  className={`absolute top-1 right-1 h-3 w-3 ${
                    badge.rarity === 'legendary'
                      ? 'text-amber-500'
                      : badge.rarity === 'epic'
                        ? 'text-purple-500'
                        : 'text-blue-500'
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 뱃지 상세 다이얼로그 */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        {selectedBadge && (
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                뱃지 정보
              </DialogTitle>
            </DialogHeader>
            <BadgeDetail
              badge={selectedBadge}
              earned={hasEarnedBadge(selectedBadge.id)}
              progress={getProgress(selectedBadge)}
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

// 뱃지 상세 컴포넌트
interface BadgeDetailProps {
  badge: Badge;
  earned: boolean;
  progress: number;
}

function BadgeDetail({ badge, earned, progress }: BadgeDetailProps) {
  const rarityStyle = RARITY_COLORS[badge.rarity];

  const rarityLabels = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설',
  };

  return (
    <div className="text-center space-y-4">
      {/* 뱃지 아이콘 */}
      <motion.div
        className={`
          w-24 h-24 mx-auto rounded-2xl flex items-center justify-center
          ${earned ? `${rarityStyle.bg} border-2 ${rarityStyle.border}` : 'bg-muted'}
        `}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <span className={`text-5xl ${!earned && 'grayscale opacity-50'}`}>
          {badge.emoji}
        </span>
      </motion.div>

      {/* 뱃지 이름 & 희귀도 */}
      <div>
        <h3 className="text-xl font-bold">{badge.name}</h3>
        <UIBadge
          variant="outline"
          className={`${rarityStyle.text} ${rarityStyle.border} ${rarityStyle.bg} mt-1`}
        >
          {rarityLabels[badge.rarity]}
        </UIBadge>
      </div>

      {/* 설명 */}
      <p className="text-muted-foreground">{badge.description}</p>

      {/* 획득 상태 */}
      {earned ? (
        <div className="py-2 px-4 bg-emerald-50 text-emerald-700 rounded-lg inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">획득 완료!</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            진행률: {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
