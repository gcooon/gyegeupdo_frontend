'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">문제가 발생했습니다</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        페이지를 로드하는 중 오류가 발생했습니다. 다시 시도해주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
