'use client';

import { ReactNode, useState, useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';
import { useSidebarStore } from '@/store/sidebarStore';
import { Toaster } from '@/components/ui/sonner';

// Dynamically import components that use router hooks
const Header = dynamic(
  () => import('@/components/layout/Header').then((mod) => ({ default: mod.Header })),
  { ssr: false }
);

const Sidebar = dynamic(
  () => import('@/components/layout/Sidebar').then((mod) => ({ default: mod.Sidebar })),
  { ssr: false }
);

const MobileNav = dynamic(
  () => import('@/components/layout/MobileNav').then((mod) => ({ default: mod.MobileNav })),
  { ssr: false }
);

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [mounted, setMounted] = useState(false);
  const { isOpen } = useSidebarStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR/hydration 전: 최소 레이아웃 (CLS 방지를 위해 실제 레이아웃 높이 유지)
  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <header className="sticky top-0 z-50 w-full h-16 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60" />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <aside className="hidden md:flex w-[250px] shrink-0" />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 pb-16 md:pb-0 px-4 md:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Suspense fallback={null}>
          <Sidebar className="hidden md:flex" />
        </Suspense>
        <div className="flex-1 flex flex-col min-w-0">
          <main className={`flex-1 pb-16 md:pb-0 px-4 md:px-6 lg:px-8 transition-all duration-200 ${!isOpen ? 'md:pl-16' : ''}`}>{children}</main>
          <Footer />
        </div>
      </div>
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
