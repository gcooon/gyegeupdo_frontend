'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, Trophy, Sparkles, GitCompare, MessageSquare, LogOut, User, Plus, Flame, Clock, Users, FileText, LayoutGrid, Crown, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebarStore } from '@/store/sidebarStore';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useBrands';
import { NAV_CATEGORIES } from '@/config/categories';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from '@/i18n';

// API 실패 시 폴백용 (중앙 설정에서 가져옴)
const FALLBACK_CATEGORIES = NAV_CATEGORIES;

// 공식 계급도 서브메뉴 (카테고리 선택 후) - 나중에 사용할 수 있으므로 유지
const OFFICIAL_SUBMENUS = [
  { key: 'tier', label: '계급도 보기', icon: Trophy },
  { key: 'quiz', label: '3분 진단', icon: Sparkles },
  { key: 'compare', label: 'VS 비교', icon: GitCompare },
  { key: 'board', label: '게시판', icon: MessageSquare },
];

// 오픈 계급도 메뉴
const OPEN_TIER_MENUS = [
  { key: 'home', labelKey: 'openTierHome', href: '/open', icon: Home, isHeader: true },
  { key: 'hallOfFame', labelKey: 'hallOfFame', href: '/open?tab=hall_of_fame', icon: Crown },
  { key: 'popular', labelKey: 'popular', href: '/open?sort=popular', icon: Flame },
  { key: 'latest', labelKey: 'latest', href: '/open?sort=latest', icon: Clock },
  { key: 'my', labelKey: 'myTiers', href: '/open/my', icon: FileText },
];

// 모바일 퀵 메뉴 (두 번째 줄에 표시)
const MOBILE_QUICK_MENUS = [
  { key: 'official', labelKey: 'officialTier', href: '/official', icon: Trophy, color: 'text-amber-500' },
  { key: 'open', labelKey: 'openTier', href: '/open', icon: Users, color: 'text-accent' },
  { key: 'create', labelKey: 'create', href: '/open/create', icon: Plus, color: 'text-emerald-500' },
];

export function Header() {
  const { toggle } = useSidebarStore();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { data: apiCategories } = useCategories();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const categories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon }))
    : FALLBACK_CATEGORIES;

  // 로그인/회원가입 후 현재 페이지로 돌아오기 위한 redirect URL
  const loginUrl = `/login?redirect=${encodeURIComponent(pathname || '/')}`;
  const signupUrl = `/signup?redirect=${encodeURIComponent(pathname || '/')}`;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      {/* 메인 헤더 줄 */}
      <div className="flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* 로고 + 타이틀 (한 줄 고정) */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold shrink-0">
              {t('brandLogo')}
            </div>
            <span className="font-bold text-base md:text-lg whitespace-nowrap">{t('brandName')}</span>
          </Link>

          {/* Desktop Navigation - lg 이상에서만 표시 */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {/* 공식 계급도 드롭다운 */}
            <div
              className="relative"
              onMouseEnter={() => setOpenCategory('official')}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <button
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${openCategory === 'official'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>{t('officialTier')}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* 공식 계급도 Dropdown - 카테고리 목록 */}
              {openCategory === 'official' && (
                <div className="absolute top-full left-0 pt-1 w-48 z-[60]">
                  <div className="bg-card border border-border rounded-lg shadow-lg py-1">
                  <Link
                    href="/official"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors border-b border-border"
                  >
                    <Home className="h-4 w-4 text-amber-500" />
                    <span>{t('officialTierHome')}</span>
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${category.slug}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <span>{category.icon}</span>
                      <span>{t('categoryTier', { name: category.name })}</span>
                    </Link>
                  ))}
                  </div>
                </div>
              )}
            </div>

            {/* 오픈 계급도 드롭다운 */}
            <div
              className="relative"
              onMouseEnter={() => setOpenCategory('open')}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <button
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${openCategory === 'open'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Users className="h-4 w-4 text-accent" />
                <span>{t('openTier')}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* 오픈 계급도 Dropdown */}
              {openCategory === 'open' && (
                <div className="absolute top-full left-0 pt-1 w-44 z-[60]">
                  <div className="bg-card border border-border rounded-lg shadow-lg py-1">
                  {OPEN_TIER_MENUS.map((menu) => {
                    const Icon = menu.icon;
                    const isHeader = 'isHeader' in menu && menu.isHeader;
                    return (
                      <Link
                        key={menu.key}
                        href={menu.href}
                        className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                          isHeader
                            ? 'font-medium text-foreground border-b border-border hover:bg-muted'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isHeader ? 'text-accent' : ''}`} />
                        {t(menu.labelKey)}
                      </Link>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>

            {/* 만들기 버튼 */}
            <Link
              href="/open/create"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors ml-1"
            >
              <Plus className="h-4 w-4" />
              <span>{tCommon('create')}</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* 언어 전환 */}
          <LanguageSwitcher />

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 md:gap-2 px-2 md:px-3">
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  <span className="hidden md:inline-block max-w-[100px] truncate">
                    {user.profile?.badge && user.profile.badge !== 'none' && (
                      <span className="mr-1">
                        {user.profile.badge === 'verified' && '✓'}
                        {user.profile.badge === 'reviewer' && '⭐'}
                        {user.profile.badge === 'master' && '👑'}
                        {user.profile.badge === 'pioneer' && '🏆'}
                      </span>
                    )}
                    {user.first_name || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.first_name || user.email.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/mypage" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t('myTiers')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  {tCommon('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="px-2 md:px-3 text-xs md:text-sm" asChild>
                <Link href={loginUrl}>{tCommon('login')}</Link>
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90 px-2 md:px-3 text-xs md:text-sm" asChild>
                <Link href={signupUrl}>{tCommon('signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 모바일 퀵 메뉴 줄 - lg 미만에서만 표시 */}
      <div className="lg:hidden border-t border-border/40">
        <div className="flex items-center justify-center gap-1 px-2 py-1.5">
          {MOBILE_QUICK_MENUS.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.key}
                href={menu.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Icon className={`h-3.5 w-3.5 ${menu.color}`} />
                <span>{menu.key === 'create' ? tCommon(menu.labelKey) : t(menu.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
