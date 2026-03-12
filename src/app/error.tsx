'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errorPage');
  const tCommon = useTranslations('common');

  useEffect(() => {
    // Error is handled by the error boundary
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {t('desc')}
      </p>
      <Button onClick={reset}>{tCommon('retry')}</Button>
    </div>
  );
}
