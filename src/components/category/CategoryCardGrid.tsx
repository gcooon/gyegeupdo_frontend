'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import type { CategoryListItem, CategoryGroup } from '@/types/model';
import { CATEGORY_GROUP_LABELS } from '@/config/categories';
import { useState, useMemo } from 'react';

interface CategoryCardGridProps {
  categories: CategoryListItem[];
  /** 그룹 탭 표시 임계값 (기본: 6) */
  groupTabThreshold?: number;
  /** 더보기 표시 임계값 (기본: 8) */
  showMoreThreshold?: number;
}

const GROUP_LABELS: Record<string, string> = {
  ...CATEGORY_GROUP_LABELS,
  '': '전체', // 그리드에서는 '기타' 대신 '전체'로 표시
};

const GROUP_ORDER: CategoryGroup[] = ['sports', 'food', 'tech', 'lifestyle'];

export function CategoryCardGrid({
  categories,
  groupTabThreshold = 6,
  showMoreThreshold = 8,
}: CategoryCardGridProps) {
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  // 그룹별 카테고리 분류
  const groupedCategories = useMemo(() => {
    const groups: Record<string, CategoryListItem[]> = {};
    categories.forEach((cat) => {
      const group = cat.group || '';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(cat);
    });
    return groups;
  }, [categories]);

  // 사용 가능한 그룹 (카테고리가 있는 그룹만)
  const availableGroups = useMemo(() => {
    return GROUP_ORDER.filter((g) => groupedCategories[g]?.length > 0);
  }, [groupedCategories]);

  // 그룹 탭 표시 여부
  const showGroupTabs = categories.length >= groupTabThreshold && availableGroups.length > 1;

  // 필터링된 카테고리
  const filteredCategories = useMemo(() => {
    if (selectedGroup === 'all') {
      return categories;
    }
    return categories.filter((cat) => cat.group === selectedGroup);
  }, [categories, selectedGroup]);

  // 표시할 카테고리 (더보기 적용)
  const displayCategories = useMemo(() => {
    if (showAll || filteredCategories.length <= showMoreThreshold) {
      return filteredCategories;
    }
    return filteredCategories.slice(0, showMoreThreshold);
  }, [filteredCategories, showAll, showMoreThreshold]);

  const hasMore = filteredCategories.length > showMoreThreshold && !showAll;

  return (
    <div className="space-y-6">
      {/* 그룹 탭 (6개 이상일 때만) */}
      {showGroupTabs && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedGroup === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGroup('all')}
            className="rounded-full"
          >
            전체
          </Button>
          {availableGroups.map((group) => (
            <Button
              key={group}
              variant={selectedGroup === group ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedGroup(group)}
              className="rounded-full"
            >
              {GROUP_LABELS[group]}
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
                {groupedCategories[group]?.length || 0}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      {/* 카테고리 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayCategories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            더 많은 카테고리 보기 ({filteredCategories.length - showMoreThreshold}개 더)
          </Button>
        </div>
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: CategoryListItem;
}

function CategoryCard({ category }: CategoryCardProps) {
  const color = category.display_config?.color || '#3B82F6';

  return (
    <Link href={`/${category.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group cursor-pointer overflow-hidden">
        <CardContent className="p-0">
          {/* 상단 컬러 바 */}
          <div
            className="h-2"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          />

          <div className="p-4">
            {/* 아이콘 + 이름 */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${color}15` }}
              >
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              {category.product_count !== undefined && (
                <span>{category.product_count}개 제품</span>
              )}
              {category.brand_count !== undefined && (
                <span>{category.brand_count}개 브랜드</span>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                style={{ borderColor: `${color}50`, color }}
                asChild
              >
                <Link href={`/${category.slug}/quiz`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  진단
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs text-white"
                style={{ background: color }}
                asChild
              >
                <Link href={`/${category.slug}`}>
                  계급도
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoryCardGrid;
