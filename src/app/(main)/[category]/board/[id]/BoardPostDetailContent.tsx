'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Clock,
  User,
  Share2,
  Flag,
  Star,
  HelpCircle,
  MessageCircle,
  TrendingUp,
  MoreHorizontal,
  Send,
} from 'lucide-react';

interface BoardPostDetailContentProps {
  category: string;
  postId: string;
}

// 게시글 타입
type PostTag = 'review' | 'question' | 'discussion' | 'tip' | 'news';

interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  replies?: Comment[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorLevel: string;
  tag: PostTag;
  productName?: string;
  productSlug?: string;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  comments: Comment[];
}

const TAG_CONFIG: Record<PostTag, { label: string; color: string; icon: React.ElementType }> = {
  review: { label: '리뷰', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Star },
  question: { label: '질문', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: HelpCircle },
  discussion: { label: '토론', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: MessageCircle },
  tip: { label: '팁/노하우', color: 'bg-green-100 text-green-700 border-green-200', icon: TrendingUp },
  news: { label: '소식', color: 'bg-red-100 text-red-700 border-red-200', icon: MessageSquare },
};

// Mock 데이터
const MOCK_POSTS: Record<string, Record<string, Post>> = {
  'running-shoes': {
    '1': {
      id: 1,
      title: '아식스 노바블라스트 5 한달 사용 후기',
      content: `안녕하세요, 러닝매니아입니다.

드디어 노바블라스트 5를 한달 동안 사용해보고 후기를 남깁니다.

## 첫인상
처음 신었을 때 느낌은 "와, 정말 푹신하다"였습니다. 전작 대비 FF BLAST+ 폼이 더 두꺼워졌고, 착지감이 훨씬 부드러워졌어요.

## 장점
1. **쿠셔닝**: 정말 말이 필요 없습니다. 장거리 뛸 때 발이 편해요.
2. **반발력**: 푹신한데도 반발력이 좋아서 페이스 유지가 수월합니다.
3. **착화감**: 발볼이 적당히 넉넉해서 오래 신어도 불편하지 않아요.
4. **디자인**: 개인적으로 이번 컬러웨이가 정말 마음에 들어요.

## 단점
1. **무게**: 전작보다 살짝 무거워진 느낌이에요. (280g → 295g)
2. **내구성**: 아직 한달이라 판단하기 어렵지만, 아웃솔이 생각보다 빨리 닳는 것 같아요.
3. **통기성**: 여름에는 조금 더울 수 있을 것 같습니다.

## 총평
10km 이하 데일리 러닝용으로는 최고의 선택이라고 생각합니다. 특히 평발이시거나 쿠셔닝을 중요시하시는 분들께 강력 추천드려요!

궁금한 점 있으시면 댓글로 남겨주세요! 성심성의껏 답변 드리겠습니다.`,
      author: '러닝매니아',
      authorLevel: '러닝 마스터',
      tag: 'review',
      productName: '노바블라스트 5',
      productSlug: 'novablast-5',
      views: 1234,
      likes: 56,
      dislikes: 3,
      createdAt: '2시간 전',
      comments: [
        {
          id: 1,
          author: '초보러너',
          content: '좋은 후기 감사합니다! 저도 구매 고민 중인데 많은 도움이 됐어요. 혹시 발볼이 넓은 편인데 사이즈 어떻게 추천하시나요?',
          likes: 12,
          dislikes: 0,
          createdAt: '1시간 전',
          replies: [
            {
              id: 2,
              author: '러닝매니아',
              content: '저도 발볼이 넓은 편인데 정사이즈로 딱 맞았어요! 다만 두꺼운 양말 신으시면 반치수 업 추천드립니다.',
              likes: 8,
              dislikes: 0,
              createdAt: '45분 전',
            },
          ],
        },
        {
          id: 3,
          author: '마라토너K',
          content: '노바블라스트 4도 좋았는데 5는 더 좋군요. 저도 갈아탈까 고민됩니다 ㅎㅎ',
          likes: 5,
          dislikes: 0,
          createdAt: '30분 전',
        },
        {
          id: 4,
          author: '런린이',
          content: '이거 가격이 얼마인가요? 할인하는 곳 있을까요?',
          likes: 2,
          dislikes: 0,
          createdAt: '15분 전',
        },
      ],
    },
    '2': {
      id: 2,
      title: '발볼 넓은 분들 추천 러닝화 있을까요?',
      content: `발볼이 넓은 편인데 요즘 나온 러닝화 중에 추천할만한 게 있을까요?

지금까지 신어본 것들:
- 나이키 페가수스: 발볼이 좁아서 포기
- 아식스 젤카야노: 괜찮았는데 조금 무거움
- 뉴발란스 1080: 발볼은 좋은데 쿠션이 너무 물렁물렁

10km 정도 러닝하는데 적당한 쿠션감 있고, 발볼 넓은 러닝화 추천 부탁드립니다!

예산은 15만원 정도 생각하고 있어요.`,
      author: '초보러너',
      authorLevel: '러닝 입문자',
      tag: 'question',
      views: 456,
      likes: 12,
      dislikes: 0,
      createdAt: '5시간 전',
      comments: [
        {
          id: 5,
          author: '러닝고수',
          content: '아식스 노바블라스트 추천드려요! 발볼 넓고 쿠션감 좋습니다. 15만원 내로 살 수 있어요.',
          likes: 15,
          dislikes: 0,
          createdAt: '4시간 전',
        },
        {
          id: 6,
          author: '마라톤준비',
          content: '브룩스 글리세린도 좋아요. 발볼 여유롭고 쿠션 밸런스 좋습니다.',
          likes: 8,
          dislikes: 0,
          createdAt: '3시간 전',
        },
      ],
    },
  },
  'chicken': {
    '101': {
      id: 101,
      title: 'BHC 뿌링클 vs BBQ 황올 최종 비교',
      content: `둘 다 먹어본 입장에서 상세 비교해봅니다.

## 뿌링클 (BHC)
- 치즈 시즈닝이 중독성 있음
- 바삭함이 오래 유지됨
- 양이 적당함
- 가격: 약 19,000원

## 황금올리브치킨 (BBQ)
- 올리브유로 튀겨서 담백함
- 기름기가 적어서 덜 느끼함
- 치킨 본연의 맛을 즐기기 좋음
- 가격: 약 20,000원

## 결론
매콤하고 중독성 있는 맛을 원하면 뿌링클, 담백하고 건강한 맛을 원하면 황올 추천드립니다!

개인적으로는 맥주 안주로는 뿌링클, 혼자 먹을 때는 황올이 더 좋았어요.`,
      author: '치킨마스터',
      authorLevel: '치킨 전문가',
      tag: 'review',
      views: 2345,
      likes: 89,
      dislikes: 5,
      createdAt: '1시간 전',
      comments: [
        {
          id: 7,
          author: '야식킹',
          content: '둘 다 맛있죠 ㅎㅎ 저는 뿌링클파입니다!',
          likes: 12,
          dislikes: 2,
          createdAt: '30분 전',
        },
        {
          id: 8,
          author: '혼닭러버',
          content: '황올이 더 낫다고 봅니다. 뿌링클은 너무 자극적이에요.',
          likes: 8,
          dislikes: 5,
          createdAt: '20분 전',
        },
      ],
    },
  },
};

const CATEGORY_CONFIG: Record<string, { name: string; icon: string }> = {
  'running-shoes': { name: '러닝화', icon: '👟' },
  'chicken': { name: '치킨', icon: '🍗' },
};

export function BoardPostDetailContent({ category, postId }: BoardPostDetailContentProps) {
  const router = useRouter();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['running-shoes'];
  const post = MOCK_POSTS[category]?.[postId];

  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">게시글을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">삭제되었거나 존재하지 않는 게시글입니다.</p>
        <Button onClick={() => router.push(`/${category}/board`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          게시판으로 돌아가기
        </Button>
      </div>
    );
  }

  const tagConfig = TAG_CONFIG[post.tag];
  const TagIcon = tagConfig.icon;

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    // TODO: API 연동
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${category}/board`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {config.icon} {config.name} 게시판
      </Button>

      {/* 게시글 본문 */}
      <Card>
        <CardContent className="p-6">
          {/* 태그 */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className={tagConfig.color}>
              <TagIcon className="h-3 w-3 mr-1" />
              {tagConfig.label}
            </Badge>
            {post.productName && (
              <Link href={`/${category}/model/${post.productSlug}`}>
                <Badge variant="secondary" className="hover:bg-accent/20 cursor-pointer">
                  {post.productName}
                </Badge>
              </Link>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between pb-4 border-b mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {post.authorLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    조회 {post.views}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* 본문 내용 */}
          <div className="prose prose-sm max-w-none dark:prose-invert mb-6">
            {post.content.split('\n').map((line, index) => {
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-lg font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.match(/^\d+\./)) {
                return <li key={index} className="ml-4">{line}</li>;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              // Bold text 처리
              const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
            })}
          </div>

          {/* 좋아요/싫어요 및 액션 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {post.likes + (liked ? 1 : 0)}
              </Button>
              <Button
                variant={disliked ? 'destructive' : 'outline'}
                size="sm"
                onClick={handleDislike}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                {post.dislikes + (disliked ? 1 : 0)}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                공유
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Flag className="h-4 w-4" />
                신고
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 {post.comments.length}개
          </h2>

          {/* 댓글 작성 */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="댓글을 작성해주세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  등록
                </Button>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  return (
    <div className={`${isReply ? 'ml-12 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-xs font-medium">{comment.author[0]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>
          <p className="text-sm mb-2">{comment.content}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 hover:text-accent ${liked ? 'text-accent' : ''}`}
            >
              <ThumbsUp className="h-3 w-3" />
              {comment.likes + (liked ? 1 : 0)}
            </button>
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 hover:text-accent"
              >
                <MessageSquare className="h-3 w-3" />
                답글
              </button>
            )}
          </div>

          {/* 답글 작성 폼 */}
          {showReplyForm && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="답글을 작성해주세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}>
                  등록
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          )}

          {/* 대댓글 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
