'use client';

// TODO: 모바일 하단 네비게이션 - 나중에 필요할 수 있으므로 코드 보존
// 다시 활성화하려면 아래 주석을 해제하고 return null을 제거하세요

export function MobileNav() {
  return null;
}

/*
// ===== 비활성화된 코드 (나중에 사용 가능) =====

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Search, MessageSquare, User } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCategories } from '@/hooks/useBrands';
import { NAV_CATEGORIES } from '@/config/categories';

const navItems = [
  { href: '/', label: '홈', icon: Home, matchExact: true },
  { href: '/{category}', label: '계급도', icon: Trophy, matchCategory: true },
  { href: '/{category}/quiz', label: '추천', icon: Search, matchPrefix: '/quiz' },
  { href: '/{category}/board', label: '게시판', icon: MessageSquare, matchPrefix: '/board' },
  { href: '/login', label: '내 정보', icon: User, matchExact: true },
];

export function MobileNav() {
  const pathname = usePathname() ?? '';
  const { isOpen: isSidebarOpen } = useSidebarStore();
  const { data: apiCategories } = useCategories();

  // 사이드바가 열려있으면 하단 네비게이션 숨김
  if (isSidebarOpen) return null;

  // API에서 가져온 카테고리 또는 폴백
  const categoryLabels: Record<string, { label: string; icon: string }> =
    (apiCategories && apiCategories.length > 0)
      ? Object.fromEntries(apiCategories.map(c => [c.slug, { label: c.name, icon: c.icon }]))
      : Object.fromEntries(NAV_CATEGORIES.map(c => [c.slug, { label: c.name, icon: c.icon }]));
  const validCategories = Object.keys(categoryLabels);

  // 현재 카테고리를 URL에서 추출 (예: /chicken/tier → chicken)
  const pathSegment = pathname.split('/')[1] || '';
  const category = validCategories.includes(pathSegment) ? pathSegment : validCategories[0] || '';
  const categoryInfo = categoryLabels[category] || { label: '계급도', icon: '📊' };

  const isActive = (item: typeof navItems[number]) => {
    if (item.matchExact) return pathname === item.href;
    if ('matchCategory' in item && item.matchCategory) {
      return pathname === `/${category}`;
    }
    if (item.matchPrefix) return pathname.includes(item.matchPrefix);
    return false;
  };

  // 카테고리에 맞게 href를 동적으로 변환
  const getHref = (item: typeof navItems[number]) => {
    if (item.matchExact) return item.href;
    return item.href.replace('{category}', category);
  };

  // 홈이 아닌 경우에만 카테고리 표시
  const showCategoryIndicator = pathname !== '/';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      {showCategoryIndicator && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-[10px] font-medium rounded-t-lg flex items-center gap-1">
          <span>{categoryInfo.icon}</span>
          <span>{categoryInfo.label}</span>
        </div>
      )}
      <div className="flex items-center justify-around h-16 safe-area-bottom">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={getHref(item)}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                active
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
*/
