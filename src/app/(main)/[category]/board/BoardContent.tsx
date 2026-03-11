'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useCategory } from '@/hooks/useBrands';
import { usePosts, useCreatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useLocaleStore } from '@/store/localeStore';
import { getCategoryInfo } from '@/config/categories';
import type { PostListItem, PostTag } from '@/types/board';

const TAG_OPTIONS: { value: PostTag | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'free', label: '자유토론' },
  { value: 'product_review', label: '제품후기' },
  { value: 'question', label: '질문' },
];

const TAG_BADGE_STYLES: Record<PostTag, string> = {
  free: 'bg-blue-100 text-blue-700 border-blue-200',
  product_review: 'bg-green-100 text-green-700 border-green-200',
  question: 'bg-orange-100 text-orange-700 border-orange-200',
};

const TAG_LABELS: Record<PostTag, string> = {
  free: '자유토론',
  product_review: '제품후기',
  question: '질문',
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
  const config = getCategoryInfo(categoryData || category);

  // URL 파라미터에서 초기 태그 읽기
  const initialTag = (searchParams.get('tag') as PostTag) || 'all';
  const [selectedTag, setSelectedTag] = useState<PostTag | 'all'>(initialTag);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tag: 'free' as PostTag,
    product_slug: '',
  });

  // URL에 ?write=true 있으면 write 다이얼로그 자동 열기
  useEffect(() => {
    if (searchParams.get('write') === 'true' && isAuthenticated) {
      const urlTag = searchParams.get('tag') as PostTag;
      const urlProduct = searchParams.get('product') || '';
      setNewPost(prev => ({
        ...prev,
        tag: urlTag || prev.tag,
        product_slug: urlProduct || prev.product_slug,
      }));
      setIsWriteDialogOpen(true);
    }
  }, [searchParams, isAuthenticated]);

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
    const needsTitle = newPost.tag !== 'product_review';
    if (needsTitle && !newPost.title.trim()) return;
    if (!newPost.content.trim()) return;
    if (newPost.tag === 'product_review' && !newPost.product_slug.trim()) return;

    try {
      const payload: {
        content: string;
        category_slug: string;
        tag: PostTag;
        title?: string;
        product_slug?: string;
      } = {
        content: newPost.content,
        category_slug: category,
        tag: newPost.tag,
      };
      if (newPost.title.trim()) payload.title = newPost.title;
      if (newPost.product_slug) payload.product_slug = newPost.product_slug;

      const createdPost = await createPost.mutateAsync(payload);
      setIsWriteDialogOpen(false);
      setNewPost({ title: '', content: '', tag: 'free', product_slug: '' });
      refetch();
      router.push(`/${category}/board/${createdPost.id}`);
    } catch {
      // 에러 처리
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
            {config.name} 게시판
          </h1>
          <p className="text-muted-foreground mt-1">
            {config.name}에 대한 자유로운 이야기와 리뷰를 나눠보세요
          </p>
        </div>
        <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!isAuthenticated}>
              <PenLine className="h-4 w-4" />
              글쓰기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>새 글 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* 태그 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">태그</label>
                <div className="flex gap-2">
                  {TAG_OPTIONS.filter(t => t.value !== 'all').map((tag) => (
                    <Button
                      key={tag.value}
                      type="button"
                      variant={newPost.tag === tag.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewPost({ ...newPost, tag: tag.value as PostTag })}
                    >
                      {tag.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 제품 선택 (제품후기일 때) */}
              {newPost.tag === 'product_review' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">관련 제품 (slug)</label>
                  <Input
                    placeholder="예: nike-pegasus-41"
                    value={newPost.product_slug}
                    onChange={(e) => setNewPost({ ...newPost, product_slug: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    제품 상세 페이지 URL의 마지막 부분을 입력하세요
                  </p>
                </div>
              )}

              {/* 제목 (제품후기는 선택사항) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  제목 {newPost.tag === 'product_review' && <span className="text-muted-foreground">(선택)</span>}
                </label>
                <Input
                  placeholder={newPost.tag === 'product_review' ? '비워두면 자동 생성됩니다' : '제목을 입력하세요'}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">내용</label>
                <Textarea
                  placeholder="내용을 입력하세요"
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWriteDialogOpen(false)}>
                취소
              </Button>
              <Button
                onClick={handleWritePost}
                disabled={writeButtonDisabled}
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  '작성하기'
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
            글을 작성하려면{' '}
            <Link href={`/login?redirect=/${category}/board`} className="text-accent underline">
              로그인
            </Link>
            이 필요합니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 태그 필터 탭 */}
      <div className="flex gap-2 flex-wrap">
        {TAG_OPTIONS.map((tag) => (
          <Button
            key={tag.value}
            variant={selectedTag === tag.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTagChange(tag.value)}
          >
            {tag.label}
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
            게시글을 불러오는 중 오류가 발생했습니다.
            <Button variant="link" onClick={() => refetch()} className="p-0 h-auto ml-2">
              다시 시도
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
                      ? '검색 결과가 없습니다.'
                      : '아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!'}
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
                이전
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
                다음
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
                    공지
                  </Badge>
                )}
                {post.tag && (
                  <Badge variant="outline" className={`text-xs ${TAG_BADGE_STYLES[post.tag]}`}>
                    {TAG_LABELS[post.tag]}
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
