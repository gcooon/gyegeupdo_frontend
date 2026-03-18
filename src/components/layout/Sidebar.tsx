'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCategories } from '@/hooks/useBrands';
import { ChevronDown, ChevronRight, Menu, X, Trophy, Plus, Users, Flame, Clock, FileText, Crown, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_CATEGORIES, groupCategories } from '@/config/categories';
import type { CategoryGroup } from '@/types/model';
import { useTranslations } from '@/i18n';

interface NavCategory {
  slug: string;
  name: string;
  icon: string;
  group: CategoryGroup;
}

// API 실패 시 폴백용 (중앙 설정에서 가져옴)
const FALLBACK_CATEGORIES: NavCategory[] = NAV_CATEGORIES.map(c => ({ ...c, group: '' as CategoryGroup }));

// 오픈 계급도 서브메뉴
const OPEN_TIER_MENUS = [
  { key: 'home', labelKey: 'openTierHome', href: '/open', icon: Home, isHeader: true },
  { key: 'hallOfFame', labelKey: 'hallOfFame', href: '/open?tab=hall_of_fame', icon: Crown },
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
  const { isOpen, close, expandedGroups, toggle, toggleGroup } = useSidebarStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: apiCategories } = useCategories();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const categories: NavCategory[] = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon, group: (c.group || '') as CategoryGroup }))
    : FALLBACK_CATEGORIES;

  // 공식 계급도 / 오픈 계급도 확장 상태 (현재 경로에 따라 초기값 설정)
  const [isOfficialExpanded, setIsOfficialExpanded] = useState(() => {
    // 오픈 계급도 경로가 아니면 공식 계급도 확장
    return !pathname.startsWith('/open');
  });
  const [isOpenTierExpanded, setIsOpenTierExpanded] = useState(() => {
    // 오픈 계급도 경로이면 오픈 계급도 확장
    return pathname.startsWith('/open');
  });

  // 초기 마운트 시 데스크톱이면 사이드바 열기, 모바일이면 닫힌 상태 유지
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop && !isOpen) {
      toggle();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 모바일에서 링크 클릭(경로 또는 쿼리 파라미터 변경) 시 사이드바 닫기
  const searchParamsString = searchParams?.toString() || '';
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && isOpen) {
      close();
    }
  }, [pathname, searchParamsString]); // eslint-disable-line react-hooks/exhaustive-deps

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
          variant="outline"
          size="icon"
          className="fixed left-4 top-20 z-40 hidden md:flex bg-card shadow-md border-border"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <aside
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed md:sticky top-0 md:top-16 left-0 z-[45] md:z-40
          h-screen md:h-[calc(100vh-4rem)]
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
                <div className="mt-1 pl-5 space-y-0.5">
                  {/* 공식 계급도 홈 링크 */}
                  <Link
                    href="/official"
                    className={`
                      flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors
                      ${pathname === '/official'
                        ? 'bg-amber-500/15 text-amber-600 font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Home className="h-3.5 w-3.5 text-amber-500" />
                    <span>{t('officialTierHome')}</span>
                  </Link>
                  {groupCategories(categories).map(({ group, items }) => {
                    const isGroupExpanded = expandedGroups.includes(group.key) || items.some(c => pathname.startsWith(`/${c.slug}`));

                    return (
                      <div key={group.key || 'etc'}>
                        {/* 그룹 헤더 (카테고리가 6개 이상일 때만 표시) */}
                        {categories.length >= 6 && (
                          <button
                            onClick={() => toggleGroup(group.key)}
                            className="w-full flex items-center justify-between px-2 py-1 mt-2 mb-0.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider hover:text-muted-foreground transition-colors"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">{group.icon}</span>
                              <span>{group.label}</span>
                            </div>
                            {isGroupExpanded
                              ? <ChevronDown className="h-2.5 w-2.5" />
                              : <ChevronRight className="h-2.5 w-2.5" />
                            }
                          </button>
                        )}

                        {/* 카테고리 목록 */}
                        {(categories.length < 6 || isGroupExpanded) && items.map((category) => {
                          const isActiveCategory = pathname.startsWith(`/${category.slug}`);

                          return (
                            <Link
                              key={category.slug}
                              href={`/${category.slug}`}
                              className={`
                                flex items-center gap-2 px-2 py-1.5 rounded-md
                                text-[13px] transition-colors
                                ${isActiveCategory
                                  ? 'bg-accent/10 text-accent font-medium'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }
                              `}
                            >
                              <span className="text-sm">{category.icon}</span>
                              <span>{category.name}</span>
                            </Link>
                          );
                        })}
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
                <div className="mt-1 pl-5 space-y-0.5">
                  {OPEN_TIER_MENUS.map((menu) => {
                    let isActive = false;
                    const isHeader = 'isHeader' in menu && menu.isHeader;
                    if (menu.key === 'home') {
                      const hasSort = searchParams?.get('sort');
                      const hasTab = searchParams?.get('tab');
                      isActive = pathname === '/open' && !hasSort && !hasTab;
                    } else if (menu.key === 'my') {
                      isActive = pathname === '/open/my' || pathname.startsWith('/open/my/');
                    } else if (menu.key === 'hallOfFame') {
                      const currentTab = searchParams?.get('tab');
                      isActive = pathname === '/open' && currentTab === 'hall_of_fame';
                    } else {
                      const currentSort = searchParams?.get('sort');
                      isActive = pathname === '/open' && currentSort === menu.key;
                    }
                    const Icon = menu.icon;
                    return (
                      <Link
                        key={menu.key}
                        href={menu.href}
                        className={`
                          flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors
                          ${isHeader ? 'font-medium' : ''}
                          ${isActive
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }
                        `}
                      >
                        <Icon className={`h-3.5 w-3.5 ${isHeader && !isActive ? 'text-accent' : ''}`} />
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
          className="fixed inset-0 bg-black/50 z-[44] md:hidden"
          onClick={toggle}
          style={{ touchAction: 'none' }}
        />
      )}
    </>
  );
}
