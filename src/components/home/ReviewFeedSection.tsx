import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { NAV_CATEGORIES } from '@/config/categories';
import { TIER_CONFIG } from '@/lib/tier';
import type { PostListItem, PostListResponse } from '@/types/board';

// 홈페이지에서 사용할 기본 카테고리
const DEFAULT_CATEGORY = NAV_CATEGORIES[0];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// 서버에서 최근 리뷰 가져오기
async function getRecentReviews(): Promise<PostListItem[]> {
  try {
    const res = await fetch(`${API_URL}/posts/?tag=product_review&page_size=4`, {
      next: { revalidate: 60 }, // 1분마다 갱신
    });

    if (!res.ok) {
      return [];
    }

    const data: PostListResponse = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch recent reviews:', error);
    return [];
  }
}

// 티어 배경색 (S티어는 금색)
function getTierBgColor(tier: string) {
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
}

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

export async function ReviewFeedSection() {
  const reviews = await getRecentReviews();

  return (
    <section className="py-12 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">커뮤니티 리뷰</h2>
            <p className="text-muted-foreground">실제 사용자들의 솔직한 후기</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/community/reviews">전체 리뷰 보기</Link>
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
                  <p className="font-semibold">내 리뷰 남기기</p>
                  <p className="text-sm text-muted-foreground">
                    다른 사용자들에게 도움이 되는 리뷰를 작성해주세요
                  </p>
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/90 shrink-0" asChild>
                <Link href={`/${DEFAULT_CATEGORY.slug}/board?tag=product_review&write=true`}>
                  리뷰 작성하기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((review) => {
              // 카테고리 아이콘 찾기
              const categoryInfo = NAV_CATEGORIES.find((c) => c.slug === review.category_slug);
              const categoryIcon = categoryInfo?.icon || '📦';

              return (
                <Link key={review.id} href={`/${review.category_slug}/board/${review.id}`}>
                  <Card className="card-base hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{categoryIcon}</span>
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {review.user.username.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.user.username}</p>
                            {review.user.badge && review.user.badge !== 'none' && (
                              <p className="text-xs text-muted-foreground">{review.user.badge}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: false,
                            locale: ko,
                          })}
                        </span>
                      </div>

                      {/* Product Info + Tier Badge */}
                      {review.product_info && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                          <span>
                            {review.product_info.brand_name} {review.product_info.name}
                          </span>
                          {review.product_info.tier && (
                            <span
                              className={`inline-flex items-center justify-center rounded-lg font-bold shadow-sm min-w-[24px] h-6 px-1.5 text-xs ${
                                review.product_info.tier === 'S'
                                  ? 'text-black animate-pulse'
                                  : 'text-white'
                              }`}
                              style={{ background: getTierBgColor(review.product_info.tier) }}
                            >
                              {review.product_info.tier}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rating */}
                      {review.rating && (
                        <div className="mb-3">
                          <StarRating rating={review.rating} />
                        </div>
                      )}

                      {/* Content */}
                      {review.content_preview && (
                        <p className="text-sm text-foreground/90 mb-4 line-clamp-2">
                          {review.content_preview}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{review.like_count}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span>{review.comment_count}</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="card-base">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
              </p>
              <Button asChild>
                <Link href={`/${DEFAULT_CATEGORY.slug}/board?tag=product_review&write=true`}>
                  첫 리뷰 작성하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* More Reviews Link */}
        {reviews.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/community/reviews"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              더 많은 리뷰 보기 →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
