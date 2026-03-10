'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, Trophy, Sparkles, GitCompare, MessageSquare, LogOut, User, Plus, Flame, Clock, Users, FileText } from 'lucide-react';
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

// 공식 계급도 서브메뉴 (카테고리 선택 후)
const OFFICIAL_SUBMENUS = [
  { key: 'tier', label: '계급도 보기', icon: Trophy },
  { key: 'quiz', label: '3분 진단', icon: Sparkles },
  { key: 'compare', label: 'VS 비교', icon: GitCompare },
  { key: 'board', label: '게시판', icon: MessageSquare },
];

// 오픈 계급도 메뉴
const OPEN_TIER_MENUS = [
  { key: 'popular', labelKey: 'popular', href: '/open?sort=popular', icon: Flame },
  { key: 'latest', labelKey: 'latest', href: '/open?sort=latest', icon: Clock },
  { key: 'my', labelKey: 'myTiers', href: '/open/my', icon: FileText },
];

export function Header() {
  const { toggle } = useSidebarStore();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { data: apiCategories } = useCategories();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const categories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon }))
    : FALLBACK_CATEGORIES;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

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
              {t('brandLogo')}
            </div>
            <span className="font-bold text-lg">{t('brandName')}</span>
          </Link>

          {/* Main Navigation */}
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
                    return (
                      <Link
                        key={menu.key}
                        href={menu.href}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Icon className="h-4 w-4" />
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

        <div className="flex items-center gap-2">
          {/* 언어 전환 */}
          <LanguageSwitcher />

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
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
                  <ChevronDown className="h-3 w-3" />
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{tCommon('login')}</Link>
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
                <Link href="/signup">{tCommon('signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
