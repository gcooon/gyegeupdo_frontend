'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Sparkles, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/', label: '홈', icon: Home, matchExact: true },
  { href: '/running-shoes/tier', label: '계급도', icon: Trophy, matchPrefix: '/tier' },
  { href: '/running-shoes/quiz', label: '진단', icon: Sparkles, matchPrefix: '/quiz' },
  { href: '/running-shoes/board', label: '게시판', icon: MessageSquare, matchPrefix: '/board' },
  { href: '/login', label: '내 정보', icon: User, matchExact: true },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (item: typeof navItems[number]) => {
    if (item.matchExact) return pathname === item.href;
    if (item.matchPrefix) return pathname.includes(item.matchPrefix);
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 safe-area-bottom">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
