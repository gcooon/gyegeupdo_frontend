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
import { MOCK_POSTS, CATEGORY_CONFIG, type PostTag, type Comment } from './mockPosts';

interface BoardPostDetailContentProps {
  category: string;
  postId: string;
}

const TAG_CONFIG: Record<PostTag, { label: string; color: string; icon: React.ElementType }> = {
  review: { label: '리뷰', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Star },
  question: { label: '질문', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: HelpCircle },
  discussion: { label: '토론', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: MessageCircle },
  tip: { label: '팁/노하우', color: 'bg-green-100 text-green-700 border-green-200', icon: TrendingUp },
  news: { label: '소식', color: 'bg-red-100 text-red-700 border-red-200', icon: MessageSquare },
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
