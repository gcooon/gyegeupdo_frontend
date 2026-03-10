'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useTranslations } from '@/i18n';

export default function NotFound() {
  const t = useTranslations('errorPage');
  const tCommon = useTranslations('common');

  return (
    <div className="container flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
      <h2 className="text-2xl font-bold mb-2">{t('notFoundTitle')}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {t('notFoundDesc')}
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="h-4 w-4 mr-2" />
          {tCommon('goHome')}
        </Link>
      </Button>
    </div>
  );
}
