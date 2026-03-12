'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronUp, ChevronDown, MessageCircle, User, LogIn } from 'lucide-react';
import type { VoteType, VoteComment } from '@/types/dispute';
import type { TierLevel } from '@/lib/tier';

interface TierVoteButtonProps {
  productId: number;
  productName: string;
  currentTier: TierLevel;
  upVotes: number;
  downVotes: number;
  userVote?: VoteType;
  comments?: VoteComment[];
  isLoggedIn?: boolean;
  onVote?: (productId: number, voteType: VoteType, comment?: string) => void;
}

export function TierVoteButton({
  productId,
  productName,
  currentTier,
  upVotes,
  downVotes,
  userVote,
  comments = [],
  isLoggedIn = false,
  onVote,
}: TierVoteButtonProps) {
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [comment, setComment] = useState('');

  const handleVoteClick = (voteType: VoteType) => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    if (userVote) {
      toast.info('이미 이 제품에 투표하셨습니다.');
      return;
    }
    setSelectedVote(voteType);
    setShowVoteDialog(true);
  };

  const handleSubmitVote = () => {
    if (selectedVote && onVote) {
      onVote(productId, selectedVote, comment || undefined);
      setShowVoteDialog(false);
      setSelectedVote(null);
      setComment('');
    }
  };

  const totalVotes = upVotes + downVotes;
  const upPercent = totalVotes > 0 ? Math.round((upVotes / totalVotes) * 100) : 50;
  const downPercent = totalVotes > 0 ? Math.round((downVotes / totalVotes) * 100) : 50;

  const upComments = comments.filter(c => c.voteType === 'up');
  const downComments = comments.filter(c => c.voteType === 'down');

  return (
    <div className="flex items-center gap-1">
      {/* Up Vote Button */}
      <button
        onClick={() => handleVoteClick('up')}
        disabled={!!userVote}
        className={`
          flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs transition-colors
          ${userVote === 'up'
            ? 'bg-emerald-500 text-white'
            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
          }
          ${userVote && userVote !== 'up' ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <ChevronUp className="h-3 w-3" />
        <span>{upVotes}</span>
      </button>

      {/* Down Vote Button */}
      <button
        onClick={() => handleVoteClick('down')}
        disabled={!!userVote}
        className={`
          flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs transition-colors
          ${userVote === 'down'
            ? 'bg-red-500 text-white'
            : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
          }
          ${userVote && userVote !== 'down' ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <ChevronDown className="h-3 w-3" />
        <span>{downVotes}</span>
      </button>

      {/* Comments Button */}
      {comments.length > 0 && (
        <Dialog open={showCommentsDialog} onOpenChange={setShowCommentsDialog}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors">
              <MessageCircle className="h-3 w-3" />
              <span>{comments.length}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{productName} 이의 의견</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Vote Summary */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-600 font-medium">UP {upPercent}%</span>
                  <span className="text-red-600 font-medium">DOWN {downPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${upPercent}%` }} />
                  <div className="bg-red-500 transition-all" style={{ width: `${downPercent}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  총 {totalVotes}명 투표
                </p>
              </div>

              {/* Up Comments */}
              {upComments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-1">
                    <ChevronUp className="h-4 w-4" />
                    UP 의견 ({upComments.length})
                  </h4>
                  <div className="space-y-2">
                    {upComments.map((c) => (
                      <CommentCard key={c.id} comment={c} />
                    ))}
                  </div>
                </div>
              )}

              {/* Down Comments */}
              {downComments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                    <ChevronDown className="h-4 w-4" />
                    DOWN 의견 ({downComments.length})
                  </h4>
                  <div className="space-y-2">
                    {downComments.map((c) => (
                      <CommentCard key={c.id} comment={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Vote Dialog */}
      <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {productName} 등급
              {selectedVote === 'up' ? ' 상향' : ' 하향'} 이의
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className={selectedVote === 'up' ? 'border-emerald-500 text-emerald-600' : 'border-red-500 text-red-600'}
              >
                현재 {currentTier}티어 → {selectedVote === 'up' ? '상향' : '하향'} 요청
              </Badge>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                의견 남기기 (선택)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="이의 사유를 입력해주세요..."
                className="w-full p-3 text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {comment.length}/200
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowVoteDialog(false)}
              >
                취소
              </Button>
              <Button
                className={`flex-1 ${selectedVote === 'up' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
                onClick={handleSubmitVote}
              >
                {selectedVote === 'up' ? 'UP' : 'DOWN'} 투표
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              제품당 1회만 투표 가능합니다
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">로그인이 필요합니다</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-accent" />
            </div>
            <p className="text-muted-foreground">
              투표에 참여하려면 로그인이 필요합니다.
              <br />
              회원이 아니시라면 무료로 가입하세요!
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLoginDialog(false)}
              >
                취소
              </Button>
              <Button className="flex-1 bg-accent hover:bg-accent/90" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CommentCard({ comment }: { comment: VoteComment }) {
  return (
    <div className="p-3 bg-card border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-3 w-3 text-primary" />
        </div>
        <span className="text-sm font-medium">{comment.userName}</span>
        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
      </div>
      <p className="text-sm text-foreground/90">{comment.comment}</p>
    </div>
  );
}
