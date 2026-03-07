'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCategories } from '@/hooks/useBrands';
import { ChevronDown, ChevronRight, Menu, X, Trophy, Sparkles, GitCompare, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// API 실패 시 폴백용 최소 카테고리 목록
const FALLBACK_CATEGORIES = [
  { slug: 'running-shoes', name: '러닝화', icon: '👟' },
  { slug: 'chicken', name: '치킨', icon: '🍗' },
  { slug: 'mens-watch', name: '남자시계', icon: '⌚' },
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: apiCategories } = useCategories();
  const categories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon }))
    : FALLBACK_CATEGORIES;

  // 모바일에서 링크 클릭(경로 변경) 시 사이드바 닫기
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && isOpen) {
      close();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // 모바일에서 사이드바 열릴 때 body 스크롤 방지
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

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
          fixed md:sticky top-16 left-0 z-50
          h-[calc(100vh-4rem)]
          ${isOpen ? 'w-64' : 'w-0 md:w-0'}
          bg-card border-r border-border
          transition-all duration-200 ease-in-out
          flex flex-col overflow-x-hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold">카테고리</span>
          <Button variant="ghost" size="icon" onClick={toggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto py-2 pb-8"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
          }}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="px-2">
            {/* 내가 만든 계급도 */}
            <div className="mb-4">
              <Link
                href="/my-tier"
                className={`
                  w-full flex items-center gap-2 px-3 py-3 rounded-lg
                  text-sm font-semibold transition-colors
                  ${pathname.startsWith('/my-tier')
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <Sparkles className="h-5 w-5 text-accent" />
                <span>내가 만든 계급도</span>
              </Link>
              {pathname.startsWith('/my-tier') && (
                <div className="ml-3 mt-1 border-l-2 border-border pl-3 space-y-0.5">
                  <Link
                    href="/my-tier"
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                      ${pathname === '/my-tier'
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Trophy className="h-4 w-4" />
                    전체 보기
                  </Link>
                  <Link
                    href="/my-tier/create"
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                      ${pathname === '/my-tier/create'
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Plus className="h-4 w-4" />
                    새로 만들기
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t border-border my-2 mx-2" />

            {categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.slug);
              const categoryPath = `/${category.slug}`;
              const isActiveCategory = pathname.startsWith(categoryPath);

              return (
                <div key={category.slug} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.slug)}
                    className={`
                      w-full flex items-center justify-between px-3 py-3 rounded-lg
                      text-sm font-semibold transition-colors
                      ${isActiveCategory
                        ? 'bg-accent/10 text-accent'
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4" />
                      : <ChevronRight className="h-4 w-4" />
                    }
                  </button>

                  {isExpanded && (
                    <div className="ml-3 mt-1 border-l-2 border-border pl-3 space-y-0.5">
                      {CATEGORY_MENUS.map((menu) => {
                        // 계급도는 카테고리 메인 페이지로 이동
                        const menuPath = menu.key === 'tier'
                          ? `/${category.slug}`
                          : `/${category.slug}/${menu.key}`;
                        const isActiveMenu = menu.key === 'tier'
                          ? pathname === `/${category.slug}`
                          : pathname === menuPath || pathname.startsWith(menuPath + '/');
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
          style={{ touchAction: 'none' }}
        />
      )}
    </>
  );
}
