'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Sparkles, GitCompare, MessageSquare } from 'lucide-react';

interface CategoryTabNavProps {
  category: string;
}

const TABS = [
  { key: 'tier', label: '계급도', icon: Trophy, getHref: (c: string) => `/${c}` },
  { key: 'quiz', label: '3분 진단', icon: Sparkles, getHref: (c: string) => `/${c}/quiz` },
  { key: 'compare', label: 'VS 비교', icon: GitCompare, getHref: (c: string) => `/${c}/compare` },
  { key: 'board', label: '게시판', icon: MessageSquare, getHref: (c: string) => `/${c}/board` },
];

export function CategoryTabNav({ category }: CategoryTabNavProps) {
  const pathname = usePathname() ?? '';

  return (
    <nav className="sticky top-16 z-30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
        {TABS.map((tab) => {
          const href = tab.getHref(category);
          const isActive = tab.key === 'tier'
            ? pathname === `/${category}` || pathname === `/${category}/tier`
            : pathname.startsWith(href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.key}
              href={href}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
