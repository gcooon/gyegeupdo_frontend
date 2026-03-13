'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  PenLine,
  Search,
  User,
  Loader2,
  AlertCircle,
  Package,
  Star,
} from 'lucide-react';
import { useCategory } from '@/hooks/useBrands';
import { usePosts, useCreatePost } from '@/hooks/usePosts';
import { useCategoryProducts } from '@/hooks/useModels';
import { useAuth } from '@/hooks/useAuth';
import { useLocaleStore } from '@/store/localeStore';
import { getCategoryInfo } from '@/config/categories';
import type { PostListItem, PostTag } from '@/types/board';
import { TIER_CONFIG, type TierLevel } from '@/lib/tier';
import { useTranslations } from '@/i18n';

// 태그 키 배열 (i18n에서 라벨 가져올 때 사용)
const TAG_KEYS: (PostTag | 'all')[] = ['all', 'free', 'product_review', 'question'];

const TAG_BADGE_STYLES: Record<PostTag, string> = {
  free: 'bg-blue-100 text-blue-700 border-blue-200',
  product_review: 'bg-green-100 text-green-700 border-green-200',
  question: 'bg-orange-100 text-orange-700 border-orange-200',
};

interface BoardContentProps {
  category: string;
}

export function BoardContent({ category }: BoardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoryData } = useCategory(category);
  const { isAuthenticated } = useAuth();
  const { locale } = useLocaleStore();
  const t = useTranslations('board');
  const tCommon = useTranslations('common');
  const config = getCategoryInfo(categoryData || category);

  // URL 파라미터에서 초기 태그 읽기
  const initialTag = (searchParams?.get('tag') as PostTag) || 'all';
  const [selectedTag, setSelectedTag] = useState<PostTag | 'all'>(initialTag);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [writeError, setWriteError] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tag: 'free' as PostTag,
    product_slug: '',
    rating: 0,
  });

  // 제품 목록 (제품후기 태그 선택 시 검색용)
  const { data: allProducts } = useCategoryProducts(category);
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let products = allProducts;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q)
      );
    }
    return products;
  }, [allProducts, productSearch]);

  // 등급별 그룹화
  const groupedProducts = useMemo(() => {
    const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];
    return tiers
      .map(tier => ({
        tier,
        label: TIER_CONFIG[tier].label,
        color: TIER_CONFIG[tier].color,
        emoji: TIER_CONFIG[tier].emoji,
        products: filteredProducts.filter(p => p.tier === tier),
      }))
      .filter(g => g.products.length > 0);
  }, [filteredProducts]);

  // URL에 ?write=true 있으면 write 다이얼로그 자동 열기
  useEffect(() => {
    if (searchParams?.get('write') === 'true' && isAuthenticated) {
      const urlTag = searchParams?.get('tag') as PostTag;
      const urlProduct = searchParams?.get('product') || '';
      setNewPost(prev => ({
        ...prev,
        tag: urlTag || prev.tag,
        product_slug: urlProduct || prev.product_slug,
      }));
      if (urlProduct && allProducts) {
        const found = allProducts.find(p => p.slug === urlProduct);
        if (found) {
          setSelectedProductName(`${found.brand?.name || ''} ${found.name}`);
        }
      }
      setIsWriteDialogOpen(true);
    }
  }, [searchParams, isAuthenticated, allProducts]);

  // API 연결
  const { data, isLoading, error, refetch } = usePosts({
    category,
    tag: selectedTag !== 'all' ? selectedTag : undefined,
    search: searchQuery || undefined,
    page,
  });
  const createPost = useCreatePost();

  const handleTagChange = (tag: PostTag | 'all') => {
    setSelectedTag(tag);
    setPage(1);
  };

  const handleWritePost = async () => {
    setWriteError('');
    const needsTitle = newPost.tag !== 'product_review';
    if (needsTitle && !newPost.title.trim()) {
      setWriteError('제목을 입력해주세요.');
      return;
    }
    if (!newPost.content.trim()) {
      setWriteError('내용을 입력해주세요.');
      return;
    }
    if (newPost.tag === 'product_review' && !newPost.product_slug.trim()) {
      setWriteError('관련 제품을 선택해주세요.');
      return;
    }

    try {
      const payload: {
        content: string;
        category_slug: string;
        tag: PostTag;
        title?: string;
        product_slug?: string;
        rating?: number;
      } = {
        content: newPost.content,
        category_slug: category,
        tag: newPost.tag,
      };
      if (newPost.title.trim()) payload.title = newPost.title;
      if (newPost.product_slug) payload.product_slug = newPost.product_slug;
      if (newPost.tag === 'product_review' && newPost.rating > 0) {
        payload.rating = newPost.rating;
      }

      const createdPost = await createPost.mutateAsync(payload);
      setIsWriteDialogOpen(false);
      setNewPost({ title: '', content: '', tag: 'free', product_slug: '', rating: 0 });
      setWriteError('');
      refetch();
      router.push(`/${category}/board/${createdPost.id}`);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      const data = axiosErr?.response?.data;
      let serverMsg = '게시글 작성에 실패했습니다.';
      if (data) {
        // DRF validation errors: { "field": ["error msg"] } or { "message": "..." }
        if (typeof data === 'object') {
          const parts: string[] = [];
          for (const [key, val] of Object.entries(data)) {
            if (Array.isArray(val)) {
              parts.push(`${key}: ${val.join(', ')}`);
            } else if (typeof val === 'string') {
              parts.push(val);
            }
          }
          if (parts.length > 0) serverMsg = parts.join(' | ');
          else serverMsg = JSON.stringify(data);
        } else {
          serverMsg = String(data);
        }
      }
      setWriteError(serverMsg);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  // 고정 게시글과 일반 게시글 분리
  const posts = data?.results || [];
  const pinnedPosts = posts.filter(post => post.is_notice);
  const regularPosts = posts.filter(post => !post.is_notice);

  const writeButtonDisabled = (() => {
    if (newPost.tag === 'product_review') {
      return !newPost.content.trim() || !newPost.product_slug.trim() || createPost.isPending;
    }
    return !newPost.title.trim() || !newPost.content.trim() || createPost.isPending;
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>{config.icon}</span>
            {t('categoryTitle', { name: config.name })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('desc', { name: config.name })}
          </p>
        </div>
        <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!isAuthenticated}>
              <PenLine className="h-4 w-4" />
              {t('write')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('writeTitle')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* 태그 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('tagSelect')}</label>
                <div className="flex gap-2">
                  {TAG_KEYS.filter(key => key !== 'all').map((tagKey) => (
                    <Button
                      key={tagKey}
                      type="button"
                      variant={newPost.tag === tagKey ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewPost({ ...newPost, tag: tagKey as PostTag })}
                    >
                      {t(`tags.${tagKey}`)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 제품 선택 (제품후기일 때) */}
              {newPost.tag === 'product_review' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('relatedProduct')}</label>
                  {selectedProductName ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Package className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-sm flex-1">{selectedProductName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          setSelectedProductName('');
                          setNewPost({ ...newPost, product_slug: '' });
                          setProductSearch('');
                        }}
                      >
                        {t('change')}
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('searchProductPlaceholder')}
                        className="pl-10"
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setProductDropdownOpen(true);
                        }}
                        onFocus={() => setProductDropdownOpen(true)}
                      />
                      {productDropdownOpen && groupedProducts.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto border rounded-md bg-background shadow-lg">
                          {groupedProducts.map((group) => (
                            <div key={group.tier}>
                              <div className="sticky top-0 px-3 py-1.5 text-xs font-semibold bg-muted/80 backdrop-blur-sm border-b flex items-center gap-1.5" style={{ color: group.color }}>
                                <span>{group.emoji}</span>
                                {group.label} ({group.tier})
                                <span className="text-muted-foreground font-normal">· {group.products.length}개</span>
                              </div>
                              {group.products.map((p) => (
                                <button
                                  key={p.slug}
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between"
                                  onClick={() => {
                                    setNewPost({ ...newPost, product_slug: p.slug });
                                    setSelectedProductName(`${p.brand?.name || ''} ${p.name}`);
                                    setProductSearch('');
                                    setProductDropdownOpen(false);
                                  }}
                                >
                                  <span>{p.brand?.name} {p.name}</span>
                                  <Badge variant="outline" className="text-xs shrink-0 ml-2" style={{ borderColor: group.color, color: group.color }}>
                                    {group.label}
                                  </Badge>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {productDropdownOpen && productSearch && filteredProducts.length === 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 border rounded-md bg-background shadow-lg p-3 text-sm text-muted-foreground text-center">
                          {t('noSearchResults')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 별점 (제품후기일 때) */}
              {newPost.tag === 'product_review' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('rating')}</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewPost({ ...newPost, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= newPost.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                    {newPost.rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground self-center">
                        {newPost.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 제목 (제품후기는 선택사항) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('titleLabel')} {newPost.tag === 'product_review' && <span className="text-muted-foreground">{t('optional')}</span>}
                </label>
                <Input
                  placeholder={newPost.tag === 'product_review' ? t('autoGeneratePlaceholder') : t('titlePlaceholder')}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('contentLabel')}</label>
                <Textarea
                  placeholder={t('contentPlaceholder')}
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>
            </div>
            {writeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{writeError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWriteDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button
                onClick={handleWritePost}
                disabled={writeButtonDisabled}
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  t('submitPost')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 로그인 안내 */}
      {!isAuthenticated && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('loginRequiredPrefix')}
            <Link href={`/login?redirect=/${category}/board`} className="text-accent underline">
              {t('loginLink')}
            </Link>
            {t('loginRequiredSuffix')}
          </AlertDescription>
        </Alert>
      )}

      {/* 태그 필터 탭 */}
      <div className="flex gap-2 flex-wrap">
        {TAG_KEYS.map((tagKey) => (
          <Button
            key={tagKey}
            variant={selectedTag === tagKey ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTagChange(tagKey)}
          >
            {t(`tags.${tagKey}`)}
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
                placeholder={t('searchPlaceholder')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">
              {t('searchButton')}
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
            {t('loadError')}
            <Button variant="link" onClick={() => refetch()} className="p-0 h-auto ml-2">
              {tCommon('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 게시글 목록 */}
      {!isLoading && !error && (
        <>
          {/* 고정 게시글 */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-2">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} category={category} locale={locale} />
              ))}
            </div>
          )}

          {/* 일반 게시글 */}
          <div className="space-y-2">
            {regularPosts.length > 0 ? (
              regularPosts.map((post) => (
                <PostCard key={post.id} post={post} category={category} locale={locale} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? t('noSearchResults')
                      : t('emptyPosts')}
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
                onClick={() => setPage(p => p - 1)}
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
                onClick={() => setPage(p => p + 1)}
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

function PostCard({
  post,
  category,
  locale,
}: {
  post: PostListItem;
  category: string;
  locale: string;
}) {
  const t = useTranslations('board');
  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'verified':
        return 'bg-blue-500';
      case 'reviewer':
        return 'bg-green-500';
      case 'master':
        return 'bg-purple-500';
      default:
        return '';
    }
  };

  // 제품 후기 스타일 (메인화면과 동일한 리뷰 카드 스타일)
  if (post.tag === 'product_review' && post.product_info) {
    return (
      <Link href={`/${category}/board/${post.id}`}>
        <Card className="card-base hover:border-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {/* 사용자 아바타 */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-accent">
                  {post.user.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* 컨텐츠 */}
              <div className="flex-1 min-w-0">
                {/* 사용자 정보 */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{post.user.username}</span>
                  {post.user.badge && post.user.badge !== 'none' && (
                    <Badge className={`text-[10px] px-1 py-0 ${getBadgeVariant(post.user.badge)}`}>
                      {post.user.badge}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: locale === 'ko' ? ko : enUS,
                    })}
                  </span>
                </div>

                {/* 제품명 + 티어 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">
                    {post.product_info.brand_name} {post.product_info.name}
                  </span>
                  {post.product_info.tier && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0"
                      style={{
                        borderColor: TIER_CONFIG[post.product_info.tier]?.color,
                        color: TIER_CONFIG[post.product_info.tier]?.color,
                      }}
                    >
                      {post.product_info.tier}
                    </Badge>
                  )}
                </div>

                {/* 별점 */}
                {post.rating && (
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= post.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* 내용 미리보기 */}
                {post.content_preview && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {post.content_preview}
                  </p>
                )}

                {/* 좋아요/댓글 */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {post.like_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {post.comment_count}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // 기본 스타일 (자유토론, 질문)
  return (
    <Link href={`/${category}/board/${post.id}`}>
      <Card
        className={`card-base hover:border-accent/50 transition-colors ${
          post.is_notice ? 'border-accent/30 bg-accent/5' : ''
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* 메인 컨텐츠 */}
            <div className="flex-1 min-w-0">
              {/* 태그 */}
              <div className="flex items-center gap-2 mb-1">
                {post.is_notice && (
                  <Badge variant="secondary" className="text-xs">
                    {t('notice')}
                  </Badge>
                )}
                {post.tag && (
                  <Badge variant="outline" className={`text-xs ${TAG_BADGE_STYLES[post.tag]}`}>
                    {t(`tags.${post.tag}`)}
                  </Badge>
                )}
                {post.product_info && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {post.product_info.brand_name} {post.product_info.name}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-base mb-2 truncate hover:text-accent transition-colors">
                {post.title}
              </h3>

              {/* 메타 정보 */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.user.username}
                  {post.user.badge && post.user.badge !== 'none' && (
                    <Badge className={`text-[10px] px-1 py-0 ml-1 ${getBadgeVariant(post.user.badge)}`}>
                      {post.user.badge}
                    </Badge>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: locale === 'ko' ? ko : enUS,
                  })}
                </span>
              </div>
            </div>

            {/* 통계 */}
            <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.view_count}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {post.like_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {post.comment_count}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
