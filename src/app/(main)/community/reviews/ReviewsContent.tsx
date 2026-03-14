'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  ThumbsUp,
  Star,
  Loader2,
  AlertCircle,
  PenLine,
  Search,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useBrands';
import { useLocaleStore } from '@/store/localeStore';
import { useTranslations } from '@/i18n';
import { NAV_CATEGORIES } from '@/config/categories';
import { TIER_CONFIG } from '@/lib/tier';
import type { PostListItem } from '@/types/board';

// API 실패 시 폴백용 필터
const FALLBACK_FILTERS = [
  { slug: 'all', name: '전체', icon: '📋' },
  ...NAV_CATEGORIES,
];

export function ReviewsContent() {
  const { isAuthenticated } = useAuth();
  const { locale } = useLocaleStore();
  const t = useTranslations('board');
  const tCommon = useTranslations('common');
  const { data: apiCategories } = useCategories();

  // API 카테고리 기반 필터 (폴백 포함)
  const categoryFilters = (apiCategories && apiCategories.length > 0)
    ? [
        { slug: 'all', name: '전체', icon: '📋' },
        ...apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon || '📦' })),
      ]
    : FALLBACK_FILTERS;

  // API 카테고리 기반 네비게이션 (아이콘 조회용)
  const navCategories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon || '📦' }))
    : NAV_CATEGORIES;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // 카테고리 필터가 'all'이면 category 파라미터 없이, 아니면 해당 카테고리로 필터
  const { data, isLoading, error, refetch } = usePosts({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    tag: 'product_review',
    search: searchQuery || undefined,
    page,
    page_size: 20,
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const posts = data?.results || [];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>📝</span>
            커뮤니티 리뷰
          </h1>
          <p className="text-muted-foreground mt-1">
            모든 카테고리의 실제 사용자 리뷰를 확인하세요
          </p>
        </div>
        <Button className="gap-2" disabled={!isAuthenticated} asChild={isAuthenticated}>
          {isAuthenticated ? (
            <Link href={`/${navCategories[0]?.slug || 'running-shoes'}/board?tag=product_review&write=true`}>
              <PenLine className="h-4 w-4" />
              글쓰기
            </Link>
          ) : (
            <>
              <PenLine className="h-4 w-4" />
              글쓰기
            </>
          )}
        </Button>
      </div>

      {/* 로그인 안내 */}
      {!isAuthenticated && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            글을 작성하려면{' '}
            <Link href="/login?redirect=/community/reviews" className="text-accent underline">
              로그인
            </Link>
            이 필요합니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 카테고리 필터 탭 */}
      <div className="flex gap-2 flex-wrap">
        {categoryFilters.map((cat) => (
          <Button
            key={cat.slug}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(cat.slug)}
            className="gap-1.5"
          >
            <span>{cat.icon}</span>
            {cat.name}
          </Button>
        ))}
      </div>

      {/* 검색 */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">
              검색
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 로딩 */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {/* 에러 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            리뷰를 불러오는 중 오류가 발생했습니다.
            <Button variant="link" onClick={() => refetch()} className="p-0 h-auto ml-2">
              {tCommon('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 리뷰 목록 */}
      {!isLoading && !error && (
        <>
          <div className="space-y-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <ReviewCard key={post.id} post={post} locale={locale} navCategories={navCategories} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? '검색 결과가 없습니다.'
                      : selectedCategory === 'all'
                        ? '아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!'
                        : '해당 카테고리에 작성된 리뷰가 없습니다.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 페이지네이션 */}
          {data && data.count > 20 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {tCommon('prev')}
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                {page} / {Math.ceil(data.count / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.next}
                onClick={() => setPage((p) => p + 1)}
              >
                {tCommon('next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 리뷰 카드 컴포넌트 (메인화면 스타일과 동일)
function ReviewCard({ post, locale, navCategories }: { post: PostListItem; locale: string; navCategories: { slug: string; name: string; icon: string }[] }) {
  // 카테고리 아이콘 찾기
  const categoryInfo = navCategories.find((c) => c.slug === post.category_slug);
  const categoryIcon = categoryInfo?.icon || '📦';

  // 티어 배경색 (S티어는 금색)
  const getTierBgColor = (tier: string) => {
    switch (tier) {
      case 'S':
        return 'rgb(255, 215, 0)';
      case 'A':
        return TIER_CONFIG.A.color;
      case 'B':
        return TIER_CONFIG.B.color;
      case 'C':
        return TIER_CONFIG.C.color;
      case 'D':
        return TIER_CONFIG.D.color;
      default:
        return TIER_CONFIG.C.color;
    }
  };

  // product_info가 없으면 일반 게시글 스타일로 표시
  if (!post.product_info) {
    return (
      <Link href={`/${post.category_slug}/board/${post.id}`}>
        <Card className="card-base hover:border-accent/50 transition-colors">
          <CardContent className="p-4">
            <h3 className="font-semibold text-base mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.content_preview}
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/${post.category_slug}/board/${post.id}`}>
      <Card className="card-base hover:border-accent/50 transition-colors">
        <CardContent className="p-4">
          {/* 헤더: 카테고리 아이콘 + 아바타 + 닉네임 + 시간 */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{categoryIcon}</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {post.user.username.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{post.user.username}</p>
                {post.user.badge && post.user.badge !== 'none' && (
                  <p className="text-[10px] text-muted-foreground">{post.user.badge}</p>
                )}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: false,
                locale: locale === 'ko' ? ko : enUS,
              })}
            </span>
          </div>

          {/* 제품명 + 티어 배지 */}
          <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
            <span>
              {post.product_info.brand_name} {post.product_info.name}
            </span>
            {post.product_info.tier && (
              <span
                className={`inline-flex items-center justify-center rounded-lg font-bold shadow-sm min-w-[24px] h-6 px-1.5 text-xs ${
                  post.product_info.tier === 'S' ? 'text-black animate-pulse' : 'text-white'
                }`}
                style={{ background: getTierBgColor(post.product_info.tier) }}
              >
                {post.product_info.tier}
              </span>
            )}
          </div>

          {/* 별점 */}
          <div className="mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    post.rating && star <= post.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 내용 미리보기 */}
          {post.content_preview && (
            <p className="text-sm text-foreground/90 mb-3 line-clamp-2">
              {post.content_preview}
            </p>
          )}

          {/* 좋아요/댓글 버튼 */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 hover:text-accent transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{post.like_count}</span>
            </span>
            <span className="flex items-center gap-1 hover:text-accent transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post.comment_count}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
