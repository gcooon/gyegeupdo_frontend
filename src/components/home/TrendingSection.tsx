import Link from 'next/link';
import { TierBadge } from '@/components/tier/TierBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { TierLevel } from '@/lib/tier';

interface TrendItem {
  rank: number;
  name: string;
  brand: string;
  tier: TierLevel;
  change: string;
  slug: string;
}

const TRENDING_UP: TrendItem[] = [
  { rank: 1, name: '노바블라스트 5', brand: '아식스', tier: 'A', change: '+12.5', slug: 'novablast-5' },
  { rank: 2, name: '클리프톤 10', brand: '호카', tier: 'A', change: '+8.3', slug: 'clifton-10' },
  { rank: 3, name: '페가수스 41', brand: '나이키', tier: 'B', change: '+7.1', slug: 'pegasus-41' },
  { rank: 4, name: '젤 카야노 31', brand: '아식스', tier: 'S', change: '+5.9', slug: 'gel-kayano-31' },
  { rank: 5, name: '1080v14', brand: '뉴발란스', tier: 'B', change: '+4.2', slug: '1080v14' },
];

interface TrendingCardProps {
  title: string;
  items: TrendItem[];
  type: 'up' | 'down';
  category: string;
}

function TrendingCard({ title, items, type, category }: TrendingCardProps) {
  const Icon = type === 'up' ? TrendingUp : TrendingDown;
  const colorClass = type === 'up' ? 'text-emerald-500' : 'text-red-500';
  const bgClass = type === 'up' ? 'bg-emerald-500/10' : 'bg-red-500/10';
  const borderClass = type === 'up' ? 'border-emerald-500/20' : 'border-red-500/20';

  return (
    <Card className="card-base">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`p-1.5 rounded-lg ${bgClass}`}>
            <Icon className={`h-4 w-4 ${colorClass}`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/${category}/model/${item.slug}`}
              className="group flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className={`
                  w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                  ${item.rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}
                `}>
                  {item.rank}
                </span>

                {/* Product Info */}
                <div>
                  <p className="font-medium text-sm group-hover:text-accent transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TierBadge tier={item.tier} size="sm" showLabel={false} />
                <span className={`
                  text-sm font-semibold px-2 py-0.5 rounded-md
                  ${bgClass} ${colorClass} border ${borderClass}
                `}>
                  {item.change}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendingSection() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">관심 상승 TOP5</h2>
            <p className="text-sm text-muted-foreground">다양한 커뮤니티와 검색수 반영</p>
          </div>
          <Link
            href="/running-shoes/tier"
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <TrendingCard
          title="이번 주 관심 급상승"
          items={TRENDING_UP}
          type="up"
          category="running-shoes"
        />
      </div>
    </section>
  );
}
