'use client';

import Link from 'next/link';
import { Sparkles, GitCompare, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/i18n';

interface OfficialQuickActionsProps {
  categorySlug: string;
}

export function OfficialQuickActions({ categorySlug }: OfficialQuickActionsProps) {
  const tOfficial = useTranslations('officialHub');

  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 to-accent/5 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{tOfficial('quickActions')}</h2>
        <p className="text-muted-foreground">{tOfficial('quickActionsDesc')}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
          <Link href={`/${categorySlug}/quiz`}>
            <Sparkles className="h-5 w-5 mr-2" />
            3분 진단
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href={`/${categorySlug}/compare`}>
            <GitCompare className="h-5 w-5 mr-2" />
            VS 비교
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href={`/${categorySlug}/board`}>
            <MessageSquare className="h-5 w-5 mr-2" />
            게시판
          </Link>
        </Button>
      </div>
    </section>
  );
}
