import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/model';
import { TierBadge } from '@/components/tier/TierBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModelTierCardProps {
  model: Product;
  category?: string;
}

export function ModelTierCard({ model, category }: ModelTierCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const href = category ? `/${category}/model/${model.slug}` : `/model/${model.slug}`;

  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        <div className="relative aspect-square bg-muted">
          {model.image_url ? (
            <Image
              src={model.image_url}
              alt={model.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          <div className="absolute top-2 left-2">
            <TierBadge tier={model.tier} size="sm" />
          </div>

          {model.trend && model.trend !== 'stable' && (
            <div className="absolute top-2 right-2">
              <Badge
                variant={model.trend === 'up' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {model.trend === 'up' ? '↑' : '↓'}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{model.brand.name}</p>
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {model.name}
            </h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {model.product_type && <span>{model.product_type}</span>}
              {model.product_type && model.usage && <span>•</span>}
              {model.usage && <span>{model.usage}</span>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-sm">
                {formatPrice(model.price_min)}원~
              </span>
              <span className="text-xs text-muted-foreground">
                후기 {model.review_count}개
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
