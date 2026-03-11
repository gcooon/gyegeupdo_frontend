import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TierBadge } from '@/components/tier/TierBadge';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import type { TierLevel } from '@/lib/tier';

interface Review {
  id: number;
  user: {
    name: string;
    avatar?: string;
    footType: string;
  };
  model: {
    name: string;
    brand: string;
    tier: TierLevel;
    slug: string;
  };
  rating: number;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

const RECENT_REVIEWS: Review[] = [
  {
    id: 1,
    user: { name: '러닝좋아', footType: '평발 / 넓은 발' },
    model: { name: '노바블라스트 5', brand: '아식스', tier: 'A', slug: 'novablast-5' },
    rating: 5,
    content: '평발인데 아치 서포트가 적당하고 쿠셔닝이 정말 좋아요. 10km 이상 달려도 발이 편합니다.',
    likes: 24,
    comments: 5,
    createdAt: '2시간 전',
  },
  {
    id: 2,
    user: { name: '마라토너K', footType: '보통 / 보통 발' },
    model: { name: '알파플라이 3', brand: '나이키', tier: 'S', slug: 'alphafly-3' },
    rating: 4,
    content: '가격이 비싸지만 레이스용으로는 최고입니다. 다만 내구성은 좀 아쉬워요.',
    likes: 18,
    comments: 3,
    createdAt: '5시간 전',
  },
  {
    id: 3,
    user: { name: '초보러너', footType: '오버프로네이션 / 좁은 발' },
    model: { name: '젤 카야노 31', brand: '아식스', tier: 'S', slug: 'gel-kayano-31' },
    rating: 5,
    content: '오버프로네이션 교정이 필요한 분들께 강력 추천합니다. 안정성이 뛰어나요.',
    likes: 31,
    comments: 8,
    createdAt: '1일 전',
  },
  {
    id: 4,
    user: { name: '런런런', footType: '정상 / 보통 발' },
    model: { name: '클리프톤 10', brand: '호카', tier: 'A', slug: 'clifton-10' },
    rating: 4,
    content: '가볍고 쿠셔닝 좋습니다. 다만 통기성이 조금 아쉬워요. 여름에는 덥습니다.',
    likes: 12,
    comments: 2,
    createdAt: '1일 전',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

export function ReviewFeedSection() {
  return (
    <section className="py-12 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">커뮤니티 리뷰</h2>
            <p className="text-muted-foreground">실제 러너들의 솔직한 후기</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/running-shoes/board?tag=product_review">전체 리뷰 보기</Link>
          </Button>
        </div>

        {/* Write Review CTA Card */}
        <Card className="card-base mb-6 border-accent/30 bg-accent/5">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">내 러닝화 리뷰 남기기</p>
                  <p className="text-sm text-muted-foreground">
                    다른 러너들에게 도움이 되는 리뷰를 작성해주세요
                  </p>
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/90 shrink-0" asChild>
                <Link href="/running-shoes/board?tag=product_review&write=true">
                  리뷰 작성하기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {RECENT_REVIEWS.map((review) => (
            <Card key={review.id} className="card-base">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {review.user.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.user.name}</p>
                      <p className="text-xs text-muted-foreground">{review.user.footType}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                </div>

                {/* Product Link */}
                <Link
                  href={`/running-shoes/model/${review.model.slug}`}
                  className="flex items-center gap-2 mb-3 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <span>{review.model.brand} {review.model.name}</span>
                  <TierBadge tier={review.model.tier} size="sm" showLabel={false} />
                </Link>

                {/* Rating */}
                <div className="mb-3">
                  <StarRating rating={review.rating} />
                </div>

                {/* Content */}
                <p className="text-sm text-foreground/90 mb-4 line-clamp-2">
                  {review.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{review.comments}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Reviews Link */}
        <div className="mt-6 text-center">
          <Link
            href="/running-shoes/board?tag=product_review"
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            더 많은 리뷰 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
