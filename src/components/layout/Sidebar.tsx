'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCategories } from '@/hooks/useBrands';
import { ChevronDown, ChevronRight, Menu, X, Trophy, Sparkles, GitCompare, MessageSquare, Plus, Users, Flame, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/i18n';

// API 실패 시 폴백용 최소 카테고리 목록
const FALLBACK_CATEGORIES = [
  { slug: 'running-shoes', name: '러닝화', icon: '👟' },
  { slug: 'chicken', name: '치킨', icon: '🍗' },
  { slug: 'mens-watch', name: '남자시계', icon: '⌚' },
];

const CATEGORY_MENUS = [
  { key: 'tier', labelKey: 'viewTier', icon: Trophy },
  { key: 'quiz', labelKey: 'quiz', icon: Sparkles },
  { key: 'compare', labelKey: 'compare', icon: GitCompare },
  { key: 'board', labelKey: 'board', icon: MessageSquare },
];

// 오픈 계급도 서브메뉴
const OPEN_TIER_MENUS = [
  { key: 'popular', labelKey: 'popular', href: '/open?sort=popular', icon: Flame },
  { key: 'latest', labelKey: 'latest', href: '/open?sort=latest', icon: Clock },
  { key: 'my', labelKey: 'myTiers', href: '/open/my', icon: FileText },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const { isOpen, close, expandedCategories, toggle, toggleCategory } = useSidebarStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: apiCategories } = useCategories();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const categories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon }))
    : FALLBACK_CATEGORIES;

  // 공식 계급도 / 오픈 계급도 확장 상태
  const [isOfficialExpanded, setIsOfficialExpanded] = useState(true);
  const [isOpenTierExpanded, setIsOpenTierExpanded] = useState(false);

  // 현재 경로에 따라 섹션 자동 확장
  useEffect(() => {
    if (pathname.startsWith('/open')) {
      setIsOpenTierExpanded(true);
    } else if (categories.some(c => pathname.startsWith(`/${c.slug}`))) {
      setIsOfficialExpanded(true);
    }
  }, [pathname, categories]);

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
          <span className="font-semibold">{tCommon('all')}</span>
          <Button variant="ghost" size="icon" onClick={toggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto py-2 pb-24"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 6rem))',
          }}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="px-2">
            {/* 🏆 공식 계급도 섹션 */}
            <div className="mb-2">
              <button
                onClick={() => setIsOfficialExpanded(!isOfficialExpanded)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-lg
                  text-sm font-semibold transition-colors
                  ${categories.some(c => pathname.startsWith(`/${c.slug}`))
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span>{t('officialTier')}</span>
                </div>
                {isOfficialExpanded
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />
                }
              </button>

              {isOfficialExpanded && (
                <div className="ml-3 mt-1 border-l-2 border-amber-200 pl-3 space-y-1">
                  {categories.map((category) => {
                    const isExpanded = expandedCategories.includes(category.slug);
                    const categoryPath = `/${category.slug}`;
                    const isActiveCategory = pathname.startsWith(categoryPath);

                    return (
                      <div key={category.slug}>
                        <button
                          onClick={() => toggleCategory(category.slug)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-lg
                            text-sm transition-colors
                            ${isActiveCategory
                              ? 'bg-accent/10 text-accent font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                          {isExpanded
                            ? <ChevronDown className="h-3 w-3" />
                            : <ChevronRight className="h-3 w-3" />
                          }
                        </button>

                        {isExpanded && (
                          <div className="ml-4 mt-0.5 border-l border-border pl-2 space-y-0.5">
                            {CATEGORY_MENUS.map((menu) => {
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
                                    flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors
                                    ${isActiveMenu
                                      ? 'bg-accent text-accent-foreground font-medium'
                                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }
                                  `}
                                >
                                  <Icon className="h-3 w-3" />
                                  {t(menu.labelKey)}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-border my-3 mx-2" />

            {/* 🎨 오픈 계급도 섹션 */}
            <div className="mb-2">
              <button
                onClick={() => setIsOpenTierExpanded(!isOpenTierExpanded)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-lg
                  text-sm font-semibold transition-colors
                  ${pathname.startsWith('/open')
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span>{t('openTier')}</span>
                </div>
                {isOpenTierExpanded
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />
                }
              </button>

              {isOpenTierExpanded && (
                <div className="ml-3 mt-1 border-l-2 border-accent/30 pl-3 space-y-0.5">
                  {OPEN_TIER_MENUS.map((menu) => {
                    // 정확한 활성 상태 체크
                    let isActive = false;
                    if (menu.key === 'my') {
                      // /open/my 페이지
                      isActive = pathname === '/open/my' || pathname.startsWith('/open/my/');
                    } else {
                      // /open?sort=popular 또는 /open?sort=latest
                      const currentSort = searchParams.get('sort');
                      isActive = pathname === '/open' && currentSort === menu.key;
                    }
                    const Icon = menu.icon;
                    return (
                      <Link
                        key={menu.key}
                        href={menu.href}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                          ${isActive
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                        {t(menu.labelKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-border my-3 mx-2" />

            {/* ➕ 만들기 버튼 */}
            <div className="px-2">
              <Link
                href="/open/create"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{t('createTier')}</span>
              </Link>
            </div>
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
