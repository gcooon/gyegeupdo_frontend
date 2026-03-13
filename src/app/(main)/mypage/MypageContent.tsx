'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  TrendingUp,
  ChevronRight,
  Settings,
  LogOut,
  Crown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGamificationStore } from '@/store/gamificationStore';
import { LEVELS, BADGES, RARITY_COLORS } from '@/types/gamification';

export function MypageContent() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const gamification = useGamificationStore();

  // 비로그인 사용자 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/mypage');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return <MypageLoadingSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // 현재 레벨 정보
  const currentLevel = LEVELS.find(
    (l) => gamification.points >= l.minPoints && gamification.points < l.maxPoints
  ) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  const progressToNextLevel = nextLevel
    ? ((gamification.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  // 획득한 뱃지들
  const earnedBadges = BADGES.filter((badge) =>
    gamification.earnedBadges.includes(badge.id)
  );

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="relative pt-0 pb-6">
          {/* 아바타 */}
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-primary">
                {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-14 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.username || '사용자'}</h1>
                {user.profile?.badge && user.profile.badge !== 'none' && (
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="h-3 w-3" />
                    {getBadgeLabel(user.profile.badge)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/mypage/settings">
                  <Settings className="h-4 w-4 mr-1" />
                  설정
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                로그아웃
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 레벨 & 포인트 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-accent" />
            레벨 & 포인트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${currentLevel.color}20` }}
            >
              {currentLevel.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">Lv. {currentLevel.level}</span>
                <span className="text-muted-foreground">{currentLevel.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {gamification.points.toLocaleString()} 포인트
              </div>
            </div>
          </div>

          {/* 레벨 진행 바 */}
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>다음 레벨까지</span>
                <span>{(nextLevel.minPoints - gamification.points).toLocaleString()} 포인트</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${progressToNextLevel}%`,
                    backgroundColor: currentLevel.color,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 활동 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<MessageSquare className="h-5 w-5" />}
          label="작성 리뷰"
          value={user.profile?.review_count || gamification.stats.reviews}
          color="text-blue-500"
        />
        <StatCard
          icon={<ThumbsUp className="h-5 w-5" />}
          label="투표 참여"
          value={gamification.stats.votes}
          color="text-emerald-500"
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="만든 계급도"
          value={gamification.stats.tierMakers}
          color="text-purple-500"
        />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="연속 방문"
          value={gamification.stats.streak}
          suffix="일"
          color="text-amber-500"
        />
      </div>

      {/* 획득 뱃지 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-accent" />
              획득 뱃지
            </div>
            <span className="text-sm text-muted-foreground font-normal">
              {earnedBadges.length} / {BADGES.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {earnedBadges.map((badge) => {
                const rarityStyle = RARITY_COLORS[badge.rarity];
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center p-3 rounded-xl border ${rarityStyle.bg} ${rarityStyle.border}`}
                    title={badge.description}
                  >
                    <span className="text-2xl mb-1">{badge.emoji}</span>
                    <span className={`text-[10px] font-medium text-center ${rarityStyle.text}`}>
                      {badge.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>아직 획득한 뱃지가 없습니다</p>
              <p className="text-sm mt-1">활동을 통해 뱃지를 모아보세요!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 빠른 링크 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">빠른 링크</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <QuickLinkItem
            href="/open/my"
            label="내가 만든 계급도"
            description="나만의 계급도를 확인하고 관리하세요"
          />
          <QuickLinkItem
            href="/open/create"
            label="새 계급도 만들기"
            description="나만의 계급도를 만들어보세요"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix = '',
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className={`mx-auto mb-2 ${color}`}>{icon}</div>
        <div className="text-2xl font-bold">
          {value.toLocaleString()}{suffix}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function QuickLinkItem({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0"
    >
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}

function MypageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="h-24 bg-muted animate-pulse" />
        <CardContent className="pt-16 pb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    verified: '인증됨',
    reviewer: '리뷰어',
    master: '마스터',
    pioneer: '개척자',
  };
  return labels[badge] || badge;
}
