'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다</h2>
          <p className="text-muted-foreground mb-6">
            예상치 못한 오류가 발생했습니다.
          </p>
          <Button onClick={reset}>다시 시도</Button>
        </div>
      </body>
    </html>
  );
}
