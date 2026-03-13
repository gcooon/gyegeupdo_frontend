import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Users, Star } from 'lucide-react';
import { NAV_CATEGORIES } from '@/config/categories';

// 홈페이지 히어로 섹션에서 사용할 기본 카테고리 (첫 번째 카테고리)
const DEFAULT_CATEGORY = NAV_CATEGORIES[0];

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-accent/10 text-accent border border-accent/20">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">2,500+ 러너들의 선택</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
            러닝화 <span className="text-accent">계급도</span>
            <br />
            한눈에 비교하세요
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            커뮤니티 리뷰를 바탕으로
            <br className="hidden sm:block" />
            S~B 티어로 분류된 러닝화 순위표
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-accent hover:bg-accent/90"
              asChild
            >
              <Link href={`/${DEFAULT_CATEGORY.slug}/tier`}>
                계급도 보러가기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              asChild
            >
              <Link href={`/${DEFAULT_CATEGORY.slug}/compare`}>
                VS 비교하기
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center p-4 rounded-xl bg-card shadow-sm">
              <Trophy className="h-5 w-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">40+</p>
              <p className="text-xs text-muted-foreground">등록 모델</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card shadow-sm">
              <Users className="h-5 w-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">2,500+</p>
              <p className="text-xs text-muted-foreground">사용자 리뷰</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card shadow-sm">
              <Star className="h-5 w-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">브랜드</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
