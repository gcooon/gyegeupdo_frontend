'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Heart,
  Eye,
  MessageCircle,
  Crown,
  Loader2,
  TrendingUp,
  Clock,
  Sparkles,
  LogIn,
  Flame,
  User,
} from 'lucide-react';
import type { UserTierChartListItem, UserTierChartListResponse, TierChartLanguage } from '@/types/tier';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import { getMockUserTierCharts } from '@/lib/mockUserTierCharts';
import { PromotionBadge } from '@/components/promotion';
import { LanguageBadge } from '@/components/tier/LanguageBadge';
import { LanguageFilter } from '@/components/tier/LanguageFilter';
import { useTranslations } from '@/i18n';

type SortOption = 'popular' | 'latest' | 'views';

type TabType = 'all' | 'hall_of_fame' | 'hot' | 'mine';

interface MyTierListContentProps {
  initialCharts?: UserTierChartListItem[];
  initialTab?: TabType;
}

export function MyTierListContent({ initialCharts, initialTab = 'all' }: MyTierListContentProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const t = useTranslations('openTier');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const [charts, setCharts] = useState<UserTierChartListItem[]>(initialCharts || []);
  const [isLoading, setIsLoading] = useState(!initialCharts?.length);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [languageFilter, setLanguageFilter] = useState<TierChartLanguage | 'all'>('all');

  // URL에서 sort와 tab 파라미터 읽기
  const urlSort = searchParams.get('sort') as SortOption | null;
  const urlTab = searchParams.get('tab') as TabType | null;

  // URL 파라미터 기반으로 상태 결정
  const sort: SortOption = urlSort && ['popular', 'latest', 'views'].includes(urlSort) ? urlSort : 'popular';
  const activeTab: TabType = urlTab && ['all', 'hall_of_fame', 'hot', 'mine'].includes(urlTab)
    ? urlTab
    : (initialTab !== 'all' ? initialTab : 'all');

  // 페이지 제목 결정 (URL 필터 기반)
  const getPageTitle = () => {
    if (initialTab === 'mine' || activeTab === 'mine') return t('myTitle');
    if (activeTab === 'hall_of_fame') return tNav('hallOfFame');
    if (activeTab === 'hot') return t('tabs.hot');
    if (urlSort === 'popular') return tNav('popular');
    if (urlSort === 'latest') return tNav('latest');
    if (urlSort === 'views') return t('sort.views');
    return t('title');
  };

  // 페이지 설명 결정 (URL 필터 기반)
  const getPageDescription = () => {
    if (initialTab === 'mine' || activeTab === 'mine') return t('pageDesc.mine');
    if (activeTab === 'hall_of_fame') return t('pageDesc.hallOfFame');
    if (activeTab === 'hot') return t('pageDesc.hot');
    if (urlSort === 'popular') return t('pageDesc.popular');
    if (urlSort === 'latest') return t('pageDesc.latest');
    if (urlSort === 'views') return t('pageDesc.views');
    return t('pageDesc.home');
  };

  // 페이지 테마 결정 (색상, 아이콘, 배지 등)
  const getPageTheme = () => {
    if (initialTab === 'mine' || activeTab === 'mine') {
      return {
        icon: User,
        color: 'accent',
        bgGradient: 'from-accent/5 via-transparent to-primary/5',
        badgeBg: 'bg-accent/10',
        badgeText: 'text-accent',
        badgeBorder: 'border-accent/20',
        iconBg: 'bg-accent/20',
        badgeLabel: t('tabs.mine'),
      };
    }
    if (activeTab === 'hall_of_fame') {
      return {
        icon: Crown,
        color: 'amber',
        bgGradient: 'from-amber-500/5 via-transparent to-yellow-500/5',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-600',
        badgeBorder: 'border-amber-500/20',
        iconBg: 'bg-amber-500/20',
        badgeLabel: t('tabs.hallOfFame'),
      };
    }
    if (activeTab === 'hot') {
      return {
        icon: Flame,
        color: 'red',
        bgGradient: 'from-red-500/5 via-transparent to-orange-500/5',
        badgeBg: 'bg-red-500/10',
        badgeText: 'text-red-600',
        badgeBorder: 'border-red-500/20',
        iconBg: 'bg-red-500/20',
        badgeLabel: t('tabs.hot'),
      };
    }
    if (urlSort === 'popular') {
      return {
        icon: Heart,
        color: 'pink',
        bgGradient: 'from-pink-500/5 via-transparent to-rose-500/5',
        badgeBg: 'bg-pink-500/10',
        badgeText: 'text-pink-600',
        badgeBorder: 'border-pink-500/20',
        iconBg: 'bg-pink-500/20',
        badgeLabel: tNav('popular'),
      };
    }
    if (urlSort === 'latest') {
      return {
        icon: Clock,
        color: 'blue',
        bgGradient: 'from-blue-500/5 via-transparent to-cyan-500/5',
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-600',
        badgeBorder: 'border-blue-500/20',
        iconBg: 'bg-blue-500/20',
        badgeLabel: tNav('latest'),
      };
    }
    if (urlSort === 'views') {
      return {
        icon: Eye,
        color: 'purple',
        bgGradient: 'from-purple-500/5 via-transparent to-violet-500/5',
        badgeBg: 'bg-purple-500/10',
        badgeText: 'text-purple-600',
        badgeBorder: 'border-purple-500/20',
        iconBg: 'bg-purple-500/20',
        badgeLabel: t('sort.views'),
      };
    }
    // 기본 (오픈 계급도 홈)
    return {
      icon: Sparkles,
      color: 'accent',
      bgGradient: 'from-accent/5 via-transparent to-primary/5',
      badgeBg: 'bg-accent/10',
      badgeText: 'text-accent',
      badgeBorder: 'border-accent/20',
      iconBg: 'bg-accent/20',
      badgeLabel: t('title'),
    };
  };

  const theme = getPageTheme();
  const ThemeIcon = theme.icon;

  // URL 업데이트 함수
  const updateURL = useCallback((newSort?: SortOption, newTab?: TabType) => {
    const params = new URLSearchParams();
    const targetSort = newSort ?? sort;
    const targetTab = newTab ?? activeTab;

    if (targetSort && targetSort !== 'popular') {
      params.set('sort', targetSort);
    }
    if (targetTab && targetTab !== 'all') {
      params.set('tab', targetTab);
    }

    const queryString = params.toString();
    router.push(`/open${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router, sort, activeTab]);

  const handleSortChange = (newSort: SortOption) => {
    setPage(1);
    updateURL(newSort, activeTab);
  };

  const handleTabChange = (newTab: TabType) => {
    // 비로그인 상태에서 "내 계급도" 탭 클릭 시 로그인 페이지로 이동
    if (newTab === 'mine' && !isAuthenticated) {
      router.push('/login?redirect=/open/my');
      return;
    }
    setPage(1);
    updateURL(sort, newTab);
  };

  const fetchCharts = useCallback(async (resetPage = false) => {
    setIsLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '12',
        sort,
      });

      if (search) {
        params.append('search', search);
      }

      if (languageFilter !== 'all') {
        params.append('language', languageFilter);
      }

      let url = `/tiers/user-charts/?${params}`;
      if (activeTab === 'mine' && isAuthenticated) {
        url = `/tiers/user-charts/my_charts/`;
      } else if (activeTab === 'hot') {
        url = `/tiers/user-charts/hot_charts/?limit=12`;
      } else if (activeTab === 'hall_of_fame') {
        url = `/tiers/user-charts/hall_of_fame/?${params}`;
      }

      const response = await api.get<{
        success: boolean;
        data: UserTierChartListResponse | UserTierChartListItem[];
        message: string;
      }>(url);

      if (response.data.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          // my_charts returns array directly
          setCharts(data);
          setTotalCount(data.length);
          setHasNext(false);
        } else {
          if (resetPage || currentPage === 1) {
            setCharts(data.items);
          } else {
            setCharts((prev) => [...prev, ...data.items]);
          }
          setTotalCount(data.total_count);
          setHasNext(data.has_next);
        }
      }
    } catch (error) {
      console.error('Failed to fetch charts:', error);
      // API 실패 시 mock 데이터 fallback
      const mockData = getMockUserTierCharts();
      setCharts(mockData.items);
      setTotalCount(mockData.total_count);
      setHasNext(mockData.has_next);
    } finally {
      setIsLoading(false);
    }
  }, [page, sort, search, activeTab, isAuthenticated, languageFilter]);

  useEffect(() => {
    if (!authLoading) {
      fetchCharts(true);
    }
  }, [sort, search, activeTab, authLoading, languageFilter]);

  useEffect(() => {
    if (page > 1 && !authLoading) {
      fetchCharts(false);
    }
  }, [page, authLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/open/create');
      return;
    }
    router.push('/open/create');
  };

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'popular', label: t('sort.popular'), icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'latest', label: t('sort.latest'), icon: <Clock className="h-4 w-4" /> },
    { value: 'views', label: t('sort.views'), icon: <Eye className="h-4 w-4" /> },
  ];

  // 내 계급도 탭인데 비로그인 상태면 로그인 유도
  if (initialTab === 'mine' && !authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="text-center py-12 px-8 max-w-md w-full">
          <CardContent className="p-0">
            <LogIn className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-xl font-bold mb-2">{t('loginRequired')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('loginRequiredDesc')}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/login?redirect=/open/my">{tCommon('login')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/open">{t('viewAll')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl">
      {/* 히어로 섹션 */}
      <section className="relative py-6 md:py-10 mb-8 overflow-hidden rounded-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} pointer-events-none`} />
        <div className="relative text-center px-4">
          {/* 배지 */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
            <ThemeIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{theme.badgeLabel}</span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            {getPageTitle()}
          </h1>

          {/* 설명 */}
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-4">
            {getPageDescription()}
          </p>

          {/* 통계 & 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            {totalCount > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {t('countDesc', { count: totalCount })}
              </Badge>
            )}
            <Button onClick={handleCreateClick} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              {tNav('createTier')}
            </Button>
          </div>
        </div>
      </section>

      {/* 탭 & 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => handleTabChange(v as TabType)}
          className="w-full md:w-auto"
        >
          <TabsList className="flex w-full md:w-auto overflow-x-auto no-scrollbar gap-1 p-1">
            <TabsTrigger value="all" className="shrink-0 min-h-[36px] px-3 touch-manipulation">
              {t('tabs.all')}
            </TabsTrigger>
            <TabsTrigger value="hall_of_fame" className="shrink-0 min-h-[36px] px-3 touch-manipulation">
              {t('tabs.hallOfFame')}
            </TabsTrigger>
            <TabsTrigger value="hot" className="shrink-0 min-h-[36px] px-3 touch-manipulation">
              {t('tabs.hot')}
            </TabsTrigger>
            <TabsTrigger value="mine" className="shrink-0 min-h-[36px] px-3 touch-manipulation">
              {t('tabs.mine')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 flex-1 md:justify-end">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 md:max-w-xs">
            <Input
              placeholder={tCommon('searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select value={sort} onValueChange={(v) => handleSortChange(v as SortOption)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    {opt.icon}
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 언어 필터 */}
      <div className="mb-6">
        <LanguageFilter
          value={languageFilter}
          onChange={(v) => { setLanguageFilter(v); setPage(1); }}
        />
      </div>

      {/* 계급도 목록 */}
      {isLoading && charts.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : charts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {search ? t('noResults') : t('empty')}
            </p>
            <Button onClick={handleCreateClick} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t('createFirst')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {charts.map((chart, index) => (
              <TierChartCard key={chart.id} chart={chart} index={index} />
            ))}
          </div>

          {/* 더보기 */}
          {hasNext && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={isLoading}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {tCommon('more')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface TierChartCardProps {
  chart: UserTierChartListItem;
  index: number;
}

function TierChartCard({ chart, index }: TierChartCardProps) {
  const t = useTranslations('tierChart');
  const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/open/${chart.slug}`}>
        <Card className="overflow-hidden hover:ring-2 ring-accent/50 transition-all cursor-pointer group">
          {/* 티어 미니 프리뷰 */}
          <div className="h-8 flex">
            {tiers.map((tier) => (
              <div
                key={tier}
                className="flex-1"
                style={{ background: TIER_CONFIG[tier].gradient }}
              />
            ))}
          </div>

          <CardContent className="p-4">
            {/* 제목 */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                {chart.title}
              </h3>
              <div className="flex gap-1 shrink-0">
                {chart.promotion_status && chart.promotion_status !== 'normal' && (
                  <PromotionBadge
                    status={chart.promotion_status}
                    statusDisplay={chart.promotion_status_display}
                    size="sm"
                  />
                )}
                {chart.is_featured && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    <Crown className="h-3 w-3 mr-1" />
                    {t('featured')}
                  </Badge>
                )}
              </div>
            </div>

            {/* 설명 */}
            {chart.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {chart.description}
              </p>
            )}

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {chart.language && (
                  <LanguageBadge language={chart.language} size="sm" />
                )}
                <Badge variant="outline" className="text-xs">
                  {chart.user_nickname}
                </Badge>
                <span>· {t('itemCount', { count: chart.item_count })}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart
                    className={`h-4 w-4 ${chart.is_liked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  {chart.like_count}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {chart.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {chart.comment_count}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
