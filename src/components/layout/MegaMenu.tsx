'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Home } from 'lucide-react';
import { groupCategories, CATEGORY_GROUPS } from '@/config/categories';
import type { CategoryGroup } from '@/types/model';
import { useTranslations } from '@/i18n';

interface NavCategory {
  slug: string;
  name: string;
  icon: string;
  group: CategoryGroup;
}

interface MegaMenuProps {
  categories: NavCategory[];
  onClose: () => void;
}

export function MegaMenu({ categories, onClose }: MegaMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('nav');

  const grouped = useMemo(() => groupCategories(categories), [categories]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return grouped;
    const q = searchQuery.toLowerCase();
    return grouped
      .map((g) => ({
        ...g,
        items: g.items.filter((c) => c.name.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [grouped, searchQuery]);

  return (
    <div className="absolute top-full left-0 pt-1 z-[60]">
      <div
        className="bg-card border border-border rounded-xl shadow-xl p-4 min-w-[480px] max-w-[640px]"
        onMouseLeave={onClose}
      >
        {/* 헤더 + 검색 */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/official"
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-amber-600 transition-colors"
            onClick={onClose}
          >
            <Home className="h-4 w-4 text-amber-500" />
            <span>{t('officialTierHome')}</span>
          </Link>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="카테고리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-40"
            />
          </div>
        </div>

        <div className="border-t border-border pt-3" />

        {/* 그룹별 그리드 */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
            {filteredGroups.map(({ group, items }) => (
              <div key={group.key || 'etc'} className="mb-3">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <span className="text-sm">{group.icon}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {items.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${category.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="text-base">{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            &ldquo;{searchQuery}&rdquo; 검색 결과가 없습니다
          </div>
        )}

        {/* 전체 보기 */}
        <div className="border-t border-border pt-2 mt-2">
          <Link
            href="/official"
            onClick={onClose}
            className="block text-center text-xs text-muted-foreground hover:text-amber-600 transition-colors py-1"
          >
            전체 카테고리 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
