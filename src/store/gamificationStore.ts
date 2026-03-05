import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserGamificationState,
  BADGES,
  LEVELS,
  POINT_ACTIONS,
  Badge,
  Level,
} from '@/types/gamification';

interface NewBadge {
  badge: Badge;
  isNew: boolean;
}

interface GamificationStore extends UserGamificationState {
  // 액션
  addPoints: (points: number) => void;
  incrementStat: (stat: keyof UserGamificationState['stats'], value?: number) => void;
  recordVisit: () => void;

  // 조회
  getCurrentLevel: () => Level;
  getProgressToNextLevel: () => number;
  checkNewBadges: () => NewBadge[];
  getBadgeById: (id: string) => Badge | undefined;
  hasEarnedBadge: (id: string) => boolean;

  // 뱃지 관련
  markBadgeAsSeen: (id: string) => void;
  newBadgeQueue: string[];
  clearNewBadgeQueue: () => void;
}

const getInitialState = (): UserGamificationState => ({
  points: 0,
  level: 1,
  earnedBadges: [],
  stats: {
    reviews: 0,
    votes: 0,
    visits: 0,
    tierMakers: 0,
    quizzes: 0,
    streak: 0,
    lastVisit: '',
  },
});

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      newBadgeQueue: [],

      addPoints: (points: number) => {
        set((state) => {
          const newPoints = state.points + points;
          const newLevel = calculateLevel(newPoints);

          return {
            points: newPoints,
            level: newLevel,
          };
        });

        // 레벨업 뱃지 체크
        get().checkNewBadges();
      },

      incrementStat: (stat, value = 1) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [stat]: (state.stats[stat] as number) + value,
          },
        }));

        // 새 뱃지 체크
        get().checkNewBadges();
      },

      recordVisit: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = state.stats.lastVisit;

        if (lastVisit === today) {
          // 오늘 이미 방문함
          return;
        }

        // 어제 방문했는지 확인
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (lastVisit === yesterdayStr) {
          // 연속 방문
          newStreak = state.stats.streak + 1;
        }

        set((state) => ({
          stats: {
            ...state.stats,
            visits: state.stats.visits + 1,
            streak: newStreak,
            lastVisit: today,
          },
        }));

        // 일일 방문 포인트 + 스트릭 보너스
        const streakBonus = newStreak > 1 ? POINT_ACTIONS.streak_bonus * (newStreak - 1) : 0;
        get().addPoints(POINT_ACTIONS.daily_visit + streakBonus);

        // 뱃지 체크
        get().checkNewBadges();
      },

      getCurrentLevel: () => {
        const { points } = get();
        return LEVELS.find((l) => points >= l.minPoints && points < l.maxPoints) || LEVELS[0];
      },

      getProgressToNextLevel: () => {
        const { points } = get();
        const currentLevel = get().getCurrentLevel();
        const range = currentLevel.maxPoints - currentLevel.minPoints;

        if (range === Infinity) return 100;

        const progress = ((points - currentLevel.minPoints) / range) * 100;
        return Math.min(100, Math.max(0, progress));
      },

      checkNewBadges: () => {
        const state = get();
        const newBadges: NewBadge[] = [];

        for (const badge of BADGES) {
          // 이미 획득한 뱃지는 스킵
          if (state.earnedBadges.includes(badge.id)) continue;

          // 요구사항 체크
          let earned = false;

          switch (badge.requirement.type) {
            case 'reviews':
              earned = state.stats.reviews >= badge.requirement.value;
              break;
            case 'votes':
              earned = state.stats.votes >= badge.requirement.value;
              break;
            case 'visits':
              earned = state.stats.visits >= badge.requirement.value;
              break;
            case 'tier_makers':
              earned = state.stats.tierMakers >= badge.requirement.value;
              break;
            case 'quizzes':
              earned = state.stats.quizzes >= badge.requirement.value;
              break;
            case 'streak':
              earned = state.stats.streak >= badge.requirement.value;
              break;
            case 'level':
              earned = state.level >= badge.requirement.value;
              break;
          }

          if (earned) {
            newBadges.push({ badge, isNew: true });

            set((state) => ({
              earnedBadges: [...state.earnedBadges, badge.id],
              newBadgeQueue: [...state.newBadgeQueue, badge.id],
            }));
          }
        }

        return newBadges;
      },

      getBadgeById: (id) => {
        return BADGES.find((b) => b.id === id);
      },

      hasEarnedBadge: (id) => {
        return get().earnedBadges.includes(id);
      },

      markBadgeAsSeen: (id) => {
        set((state) => ({
          newBadgeQueue: state.newBadgeQueue.filter((badgeId) => badgeId !== id),
        }));
      },

      clearNewBadgeQueue: () => {
        set({ newBadgeQueue: [] });
      },
    }),
    {
      name: 'gamification-storage',
    }
  )
);

// 헬퍼 함수
function calculateLevel(points: number): number {
  const level = LEVELS.find((l) => points >= l.minPoints && points < l.maxPoints);
  return level?.level || 1;
}
