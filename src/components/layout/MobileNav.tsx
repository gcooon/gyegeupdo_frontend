'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Search, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/', label: '홈', icon: Home, matchExact: true },
  { href: '/running-shoes', label: '계급도', icon: Trophy, matchCategory: true },
  { href: '/running-shoes/quiz', label: '추천', icon: Search, matchPrefix: '/quiz' },
  { href: '/running-shoes/board', label: '게시판', icon: MessageSquare, matchPrefix: '/board' },
  { href: '/login', label: '내 정보', icon: User, matchExact: true },
];

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  'running-shoes': { label: '러닝화', icon: '👟' },
  'chicken': { label: '치킨', icon: '🍗' },
};

export function MobileNav() {
  const pathname = usePathname() ?? '';

  // 현재 카테고리를 URL에서 추출 (예: /chicken/tier → chicken)
  const currentCategory = pathname.split('/')[1] || 'running-shoes';
  const validCategories = ['running-shoes', 'chicken'];
  const category = validCategories.includes(currentCategory) ? currentCategory : 'running-shoes';
  const categoryInfo = CATEGORY_LABELS[category] || CATEGORY_LABELS['running-shoes'];

  const isActive = (item: typeof navItems[number]) => {
    if (item.matchExact) return pathname === item.href;
    if ('matchCategory' in item && item.matchCategory) {
      // 카테고리 루트 페이지에서만 활성화 (예: /running-shoes, /chicken)
      return pathname === `/${category}`;
    }
    if (item.matchPrefix) return pathname.includes(item.matchPrefix);
    return false;
  };

  // 카테고리에 맞게 href를 동적으로 변환
  const getHref = (item: typeof navItems[number]) => {
    if (item.matchExact) return item.href;
    if ('matchCategory' in item && item.matchCategory) {
      // 카테고리 루트 페이지로 이동
      return `/${category}`;
    }
    // /running-shoes/quiz → /{현재카테고리}/quiz
    return item.href.replace('running-shoes', category);
  };

  // 홈이 아닌 경우에만 카테고리 표시
  const showCategoryIndicator = pathname !== '/';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      {/* 현재 카테고리 표시 */}
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
