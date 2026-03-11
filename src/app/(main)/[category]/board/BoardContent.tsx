'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { useCategory } from '@/hooks/useBrands';
import { usePosts, useCreatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useLocaleStore } from '@/store/localeStore';
import { getCategoryInfo } from '@/config/categories';
import type { PostListItem } from '@/types/board';

interface BoardContentProps {
  category: string;
}

export function BoardContent({ category }: BoardContentProps) {
  const router = useRouter();
  const { data: categoryData } = useCategory(category);
  const { isAuthenticated } = useAuth();
  const { locale } = useLocaleStore();
  const config = getCategoryInfo(categoryData || category);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });

  // API 연결
  const { data, isLoading, error, refetch } = usePosts({
    category,
    search: searchQuery || undefined,
    page,
  });
  const createPost = useCreatePost();

  const handleWritePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const createdPost = await createPost.mutateAsync({
        title: newPost.title,
        content: newPost.content,
        category_slug: category,
      });
      setIsWriteDialogOpen(false);
      setNewPost({ title: '', content: '' });
      refetch();
      // 작성 후 상세 페이지로 이동
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
              <div className="space-y-2">
                <label className="text-sm font-medium">제목</label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
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
                disabled={!newPost.title.trim() || !newPost.content.trim() || createPost.isPending}
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
                    📌 공지
                  </Badge>
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
