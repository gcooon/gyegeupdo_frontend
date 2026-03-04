'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, Trophy, Sparkles, GitCompare, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/sidebarStore';

const CATEGORIES = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    enabled: true,
  },
  {
    slug: 'chicken',
    name: '치킨',
    icon: '🍗',
    enabled: true,
  },
];

const CATEGORY_MENUS = [
  { key: 'tier', label: '계급도 보기', icon: Trophy },
  { key: 'quiz', label: '3분 진단', icon: Sparkles },
  { key: 'compare', label: 'VS 비교', icon: GitCompare },
  { key: 'board', label: '게시판', icon: MessageSquare },
];

export function Header() {
  const { toggle } = useSidebarStore();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
              계
            </div>
            <span className="hidden font-bold text-lg sm:inline-block">계급도</span>
          </Link>

          {/* Category Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {CATEGORIES.map((category) => (
              <div
                key={category.slug}
                className="relative"
                onMouseEnter={() => category.enabled && setOpenCategory(category.slug)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <button
                  disabled={!category.enabled}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${!category.enabled
                      ? 'opacity-50 cursor-not-allowed'
                      : openCategory === category.slug
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  {category.enabled && <ChevronDown className="h-3 w-3" />}
                  {!category.enabled && <span className="text-xs">(준비중)</span>}
                </button>

                {/* Dropdown */}
                {category.enabled && openCategory === category.slug && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                    {CATEGORY_MENUS.map((menu) => {
                      const Icon = menu.icon;
                      return (
                        <Link
                          key={menu.key}
                          href={`/${category.slug}/${menu.key}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                          {menu.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
