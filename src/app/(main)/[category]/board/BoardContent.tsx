'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  PenLine,
  Search,
  Filter,
  User,
  TrendingUp,
  Star,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

interface BoardContentProps {
  category: string;
}

// 카테고리별 설정
const CATEGORY_CONFIG: Record<string, {
  name: string;
  icon: string;
}> = {
  'running-shoes': {
    name: '러닝화',
    icon: '👟',
  },
  'chicken': {
    name: '치킨',
    icon: '🍗',
  },
};

// 게시글 타입
type PostTag = 'review' | 'question' | 'discussion' | 'tip' | 'news';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  tag: PostTag;
  productName?: string;
  productSlug?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  isHot?: boolean;
  isPinned?: boolean;
}

const TAG_CONFIG: Record<PostTag, { label: string; color: string; icon: React.ElementType }> = {
  review: { label: '리뷰', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Star },
  question: { label: '질문', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: HelpCircle },
  discussion: { label: '토론', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: MessageCircle },
  tip: { label: '팁/노하우', color: 'bg-green-100 text-green-700 border-green-200', icon: TrendingUp },
  news: { label: '소식', color: 'bg-red-100 text-red-700 border-red-200', icon: MessageSquare },
};

// Mock 데이터
const MOCK_POSTS: Record<string, Post[]> = {
  'running-shoes': [
    {
      id: 1,
      title: '아식스 노바블라스트 5 한달 사용 후기',
      content: '드디어 한달 사용 후기 올립니다. 결론부터 말씀드리면 정말 만족스럽습니다...',
      author: '러닝매니아',
      tag: 'review',
      productName: '노바블라스트 5',
      productSlug: 'novablast-5',
      views: 1234,
      likes: 56,
      comments: 23,
      createdAt: '2시간 전',
      isHot: true,
    },
    {
      id: 2,
      title: '발볼 넓은 분들 추천 러닝화 있을까요?',
      content: '발볼이 넓은 편인데 요즘 나온 러닝화 중에 추천할만한 게 있을까요?',
      author: '초보러너',
      tag: 'question',
      views: 456,
      likes: 12,
      comments: 34,
      createdAt: '5시간 전',
    },
    {
      id: 3,
      title: '페가수스 41 vs 클리프톤 10 고민중',
      content: '두 제품 중 하나 구매하려는데 실제로 신어보신 분들 의견 부탁드립니다.',
      author: '마라톤준비',
      tag: 'discussion',
      views: 789,
      likes: 28,
      comments: 45,
      createdAt: '1일 전',
      isHot: true,
    },
    {
      id: 4,
      title: '러닝화 오래 신는 관리 팁 공유',
      content: '러닝화를 오래 신기 위한 관리 방법을 공유합니다. 1. 번갈아 신기...',
      author: '런코치',
      tag: 'tip',
      views: 2341,
      likes: 89,
      comments: 15,
      createdAt: '2일 전',
      isPinned: true,
    },
    {
      id: 5,
      title: '[속보] 아식스 2025 신제품 라인업 공개',
      content: '아식스가 2025년 신제품 라인업을 공개했습니다. 주목할만한 제품들을 살펴보면...',
      author: '러닝뉴스',
      tag: 'news',
      views: 3456,
      likes: 67,
      comments: 28,
      createdAt: '3일 전',
    },
    {
      id: 6,
      title: '젤카야노 31 안정화 진짜 좋나요?',
      content: '오버프로네이션이 있어서 안정화를 찾고 있는데 젤카야노 추천이 많더라고요.',
      author: '건강러닝',
      tag: 'question',
      views: 234,
      likes: 8,
      comments: 19,
      createdAt: '4일 전',
    },
    {
      id: 7,
      title: '뉴발란스 1080v14 솔직 후기',
      content: '기대하고 구매했는데... 솔직히 말씀드리면 기대 이상이었습니다.',
      author: '달리기좋아',
      tag: 'review',
      productName: '1080v14',
      productSlug: '1080v14',
      views: 567,
      likes: 34,
      comments: 11,
      createdAt: '5일 전',
    },
  ],
  'chicken': [
    {
      id: 101,
      title: 'BHC 뿌링클 vs BBQ 황올 최종 비교',
      content: '둘 다 먹어본 입장에서 상세 비교해봅니다. 결론부터 말씀드리면...',
      author: '치킨마스터',
      tag: 'review',
      views: 2345,
      likes: 89,
      comments: 56,
      createdAt: '1시간 전',
      isHot: true,
    },
    {
      id: 102,
      title: '혼자 먹기 좋은 치킨 메뉴 추천해주세요',
      content: '혼자서 먹기에 양 적당하고 맛있는 메뉴 추천 부탁드립니다.',
      author: '혼닭러버',
      tag: 'question',
      views: 678,
      likes: 23,
      comments: 41,
      createdAt: '3시간 전',
    },
    {
      id: 103,
      title: '굽네 vs 후라이드 치킨 뭐가 더 맛있나요?',
      content: '오븐구이 치킨이랑 일반 후라이드 중에 고민되네요.',
      author: '치킨고민',
      tag: 'discussion',
      views: 456,
      likes: 15,
      comments: 38,
      createdAt: '6시간 전',
    },
    {
      id: 104,
      title: '치킨 배달 꿀팁 모음',
      content: '배달 치킨 주문할 때 알아두면 좋은 팁들을 정리해봤습니다.',
      author: '배달왕',
      tag: 'tip',
      views: 1890,
      likes: 76,
      comments: 22,
      createdAt: '1일 전',
      isPinned: true,
    },
    {
      id: 105,
      title: '[신메뉴] 교촌 신메뉴 출시 소식',
      content: '교촌에서 새로운 메뉴를 출시했습니다. 가격은...',
      author: '치킨뉴스',
      tag: 'news',
      views: 1234,
      likes: 45,
      comments: 19,
      createdAt: '2일 전',
    },
    {
      id: 106,
      title: '매운 치킨 추천 부탁드립니다',
      content: '정말 매운 치킨 먹고 싶은데 추천 부탁드려요!',
      author: '매운맛좋아',
      tag: 'question',
      views: 345,
      likes: 11,
      comments: 27,
      createdAt: '3일 전',
    },
  ],
};

export function BoardContent({ category }: BoardContentProps) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['running-shoes'];
  const posts = MOCK_POSTS[category] || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<PostTag | 'all'>('all');
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tag: 'discussion' as PostTag,
  });

  // 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || post.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  // 고정 게시글과 일반 게시글 분리
  const pinnedPosts = filteredPosts.filter(post => post.isPinned);
  const regularPosts = filteredPosts.filter(post => !post.isPinned);

  const handleWritePost = () => {
    // TODO: API 연동
    setIsWriteDialogOpen(false);
    setNewPost({ title: '', content: '', tag: 'discussion' });
  };

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
            <Button className="gap-2">
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
                <label className="text-sm font-medium">카테고리</label>
                <Select
                  value={newPost.tag}
                  onValueChange={(value) => setNewPost({ ...newPost, tag: value as PostTag })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TAG_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Button onClick={handleWritePost}>작성하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => setSelectedTag(value as PostTag | 'all')}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {Object.entries(TAG_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 태그 필터 버튼 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTag === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTag('all')}
        >
          전체
        </Button>
        {Object.entries(TAG_CONFIG).map(([key, config]) => (
          <Button
            key={key}
            variant={selectedTag === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(key as PostTag)}
            className="gap-1"
          >
            <config.icon className="h-3 w-3" />
            {config.label}
          </Button>
        ))}
      </div>

      {/* 고정 게시글 */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-2">
          {pinnedPosts.map((post) => (
            <PostCard key={post.id} post={post} category={category} />
          ))}
        </div>
      )}

      {/* 게시글 목록 */}
      <div className="space-y-2">
        {regularPosts.length > 0 ? (
          regularPosts.map((post) => (
            <PostCard key={post.id} post={post} category={category} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || selectedTag !== 'all'
                  ? '검색 결과가 없습니다.'
                  : '아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 페이지네이션 (Mock) */}
      <div className="flex justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>
          이전
        </Button>
        <Button variant="default" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">
          다음
        </Button>
      </div>
    </div>
  );
}

function PostCard({ post, category }: { post: Post; category: string }) {
  const tagConfig = TAG_CONFIG[post.tag];
  const TagIcon = tagConfig.icon;

  return (
    <Link href={`/${category}/board/${post.id}`}>
      <Card className={`card-base hover:border-accent/50 transition-colors ${post.isPinned ? 'border-accent/30 bg-accent/5' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* 메인 컨텐츠 */}
            <div className="flex-1 min-w-0">
              {/* 태그 및 제목 */}
              <div className="flex items-center gap-2 mb-1">
                {post.isPinned && (
                  <Badge variant="secondary" className="text-xs">
                    📌 공지
                  </Badge>
                )}
                {post.isHot && (
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                    🔥 HOT
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs ${tagConfig.color}`}>
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tagConfig.label}
                </Badge>
              </div>

              <h3 className="font-semibold text-base mb-1 truncate hover:text-accent transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {post.content}
              </p>

              {/* 제품 태그 */}
              {post.productName && (
                <Badge variant="secondary" className="text-xs mb-2">
                  {post.productName}
                </Badge>
              )}

              {/* 메타 정보 */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.createdAt}
                </span>
              </div>
            </div>

            {/* 통계 */}
            <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {post.comments}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
