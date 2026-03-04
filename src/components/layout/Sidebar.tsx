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
  subLabel?: string; // 하위 항목 라벨 (브랜드, 인기 메뉴 등)
  items?: { slug: string; name: string }[];
}

const CATEGORIES: Category[] = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    enabled: true,
    subLabel: '인기 제품',
    items: [
      { slug: 'novablast-5', name: '노바블라스트 5' },
      { slug: 'gel-kayano-31', name: '젤 카야노 31' },
      { slug: 'alphafly-3', name: '알파플라이 3' },
      { slug: 'vaporfly-3', name: '베이퍼플라이 3' },
      { slug: 'clifton-10', name: '클리프톤 10' },
      { slug: '1080v14', name: '1080v14' },
      { slug: 'endorphin-speed-4', name: '엔돌핀 스피드 4' },
      { slug: 'glycerin-21', name: '글리세린 21' },
    ],
  },
  {
    slug: 'chicken',
    name: '치킨',
    icon: '🍗',
    enabled: true,
    subLabel: '인기 메뉴',
    items: [
      { slug: 'bbq-golden-olive', name: '황금올리브치킨' },
      { slug: 'kyochon-original', name: '교촌 오리지날' },
      { slug: 'bhc-puringkle', name: '뿌링클' },
      { slug: 'kyochon-red', name: '교촌 레드' },
      { slug: 'goobne-gochu', name: '굽네 고추바사삭' },
      { slug: 'nene-snowing', name: '네네 스노윙' },
      { slug: 'puradak-black-allio', name: '푸라닭 블랙알리오' },
    ],
  },
];

// 카테고리별 서브 메뉴
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
  const pathname = usePathname();
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
      {/* Toggle Button - visible on tablet+ when sidebar is closed */}
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

      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed md:sticky top-16 left-0 z-40
          h-[calc(100vh-4rem)] w-64
          bg-card border-r border-border
          transition-transform duration-200 ease-in-out
          flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold">카테고리</span>
          <Button variant="ghost" size="icon" onClick={toggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Categories */}
          <div className="px-2">
            {CATEGORIES.map((category) => {
              const isExpanded = expandedCategories.includes(category.slug);
              const categoryPath = `/${category.slug}`;
              const isActiveCategory = pathname.startsWith(categoryPath);

              return (
                <div key={category.slug} className="mb-2">
                  {/* Category Header */}
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

                  {/* Sub-items */}
                  {category.enabled && isExpanded && (
                    <div className="ml-3 mt-1 border-l-2 border-border pl-3 space-y-0.5">
                      {/* Category Menus (계급도/3분진단/VS비교) */}
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

                      {/* Sub Items (Brands or Menus) */}
                      {category.items && category.items.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-border/50">
                          <p className="px-3 py-1 text-xs text-muted-foreground font-medium">
                            {category.subLabel || '항목'}
                          </p>
                          <div className="space-y-0.5">
                            {category.items.map((item) => {
                              // 모든 카테고리 인기 제품은 model 경로 사용
                              const itemPath = `/${category.slug}/model/${item.slug}`;
                              const isActiveItem = pathname === itemPath || pathname.startsWith(itemPath + '/');

                              return (
                                <Link
                                  key={item.slug}
                                  href={itemPath}
                                  className={`
                                    block px-3 py-1.5 rounded-lg text-sm transition-colors
                                    ${isActiveItem
                                      ? 'bg-accent text-accent-foreground font-medium'
                                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }
                                  `}
                                >
                                  {item.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        />
      )}
    </>
  );
}
