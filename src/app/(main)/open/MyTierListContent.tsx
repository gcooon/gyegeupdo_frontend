'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import type { UserTierChartListItem, UserTierChartListResponse } from '@/types/tier';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import { getMockUserTierCharts } from '@/lib/mockUserTierCharts';

type SortOption = 'popular' | 'latest' | 'views';

interface MyTierListContentProps {
  initialCharts?: UserTierChartListItem[];
  initialTab?: 'all' | 'featured' | 'mine';
}

export function MyTierListContent({ initialCharts, initialTab = 'all' }: MyTierListContentProps = {}) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [charts, setCharts] = useState<UserTierChartListItem[]>(initialCharts || []);
  const [isLoading, setIsLoading] = useState(!initialCharts?.length);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState<SortOption>('popular');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'mine'>(initialTab);

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

      if (activeTab === 'featured') {
        params.append('featured', 'true');
      }

      let url = `/tiers/user-charts/?${params}`;
      if (activeTab === 'mine' && isAuthenticated) {
        url = `/tiers/user-charts/my_charts/`;
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
  }, [page, sort, search, activeTab, isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchCharts(true);
    }
  }, [sort, search, activeTab, authLoading]);

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
    { value: 'popular', label: '인기순', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'latest', label: '최신순', icon: <Clock className="h-4 w-4" /> },
    { value: 'views', label: '조회순', icon: <Eye className="h-4 w-4" /> },
  ];

  // 내 계급도 탭인데 비로그인 상태면 로그인 유도
  if (initialTab === 'mine' && !authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="text-center py-12 px-8 max-w-md w-full">
          <CardContent className="p-0">
            <LogIn className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
            <p className="text-muted-foreground mb-6">
              내가 만든 계급도를 확인하려면 로그인해주세요.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/login?redirect=/open/my">로그인</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/open">전체 계급도 보기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-accent" />
            {initialTab === 'mine' ? '내 계급도' : '오픈 계급도'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {totalCount > 0 ? `${totalCount}개의 계급도` : '누구나 만들고 공유하는 계급도'}
          </p>
        </div>
        <Button onClick={handleCreateClick} className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          계급도 만들기
        </Button>
      </div>

      {/* 탭 & 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as 'all' | 'featured' | 'mine');
            setPage(1);
          }}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="featured">
              <Crown className="h-4 w-4 mr-1" />
              추천
            </TabsTrigger>
            <TabsTrigger value="mine" disabled={!isAuthenticated}>
              내 계급도
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 flex-1 md:justify-end">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 md:max-w-xs">
            <Input
              placeholder="검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select value={sort} onValueChange={(v) => { setSort(v as SortOption); setPage(1); }}>
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
              {search ? '검색 결과가 없습니다.' : '아직 계급도가 없습니다.'}
            </p>
            <Button onClick={handleCreateClick} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 계급도 만들기
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
                더 보기
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
              {chart.is_featured && (
                <Badge variant="secondary" className="shrink-0">
                  <Crown className="h-3 w-3 mr-1" />
                  추천
                </Badge>
              )}
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
                <Badge variant="outline" className="text-xs">
                  {chart.user_nickname}
                </Badge>
                <span>· {chart.item_count}개 항목</span>
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
