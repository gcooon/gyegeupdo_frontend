'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { ChevronDown, ChevronRight, Menu, X, Trophy, Sparkles, GitCompare, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  slug: string;
  name: string;
  icon: string;
  enabled: boolean;
}

const CATEGORIES: Category[] = [
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

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const { isOpen, close, expandedCategories, toggle, toggleCategory } = useSidebarStore();

  // 모바일에서 링크 클릭(경로 변경) 시 사이드바 닫기
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && isOpen) {
      close();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-20 z-40 hidden md:flex"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <aside
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed md:sticky top-16 left-0 z-40
          h-[calc(100vh-4rem)]
          ${isOpen ? 'w-64' : 'w-0 md:w-0'}
          bg-card border-r border-border
          transition-all duration-200 ease-in-out
          flex flex-col overflow-hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold">카테고리</span>
          <Button variant="ghost" size="icon" onClick={toggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain py-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="px-2">
            {CATEGORIES.map((category) => {
              const isExpanded = expandedCategories.includes(category.slug);
              const categoryPath = `/${category.slug}`;
              const isActiveCategory = pathname.startsWith(categoryPath);

              return (
                <div key={category.slug} className="mb-2">
                  <button
                    onClick={() => category.enabled && toggleCategory(category.slug)}
                    disabled={!category.enabled}
                    className={`
                      w-full flex items-center justify-between px-3 py-3 rounded-lg
                      text-sm font-semibold transition-colors
                      ${!category.enabled
                        ? 'opacity-50 cursor-not-allowed'
                        : isActiveCategory
                          ? 'bg-accent/10 text-accent'
                          : 'hover:bg-muted'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                      {!category.enabled && (
                        <span className="text-xs text-muted-foreground font-normal">(준비중)</span>
                      )}
                    </div>
                    {category.enabled && (
                      isExpanded
                        ? <ChevronDown className="h-4 w-4" />
                        : <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {category.enabled && isExpanded && (
                    <div className="ml-3 mt-1 border-l-2 border-border pl-3 space-y-0.5">
                      {CATEGORY_MENUS.map((menu) => {
                        const menuPath = `/${category.slug}/${menu.key}`;
                        const isActiveMenu = pathname === menuPath || pathname.startsWith(menuPath + '/');
                        const Icon = menu.icon;

                        return (
                          <Link
                            key={menu.key}
                            href={menuPath}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                              ${isActiveMenu
                                ? 'bg-accent text-accent-foreground font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              }
                            `}
                          >
                            <Icon className="h-4 w-4" />
                            {menu.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        />
      )}
    </>
  );
}
