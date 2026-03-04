import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
      <h2 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
