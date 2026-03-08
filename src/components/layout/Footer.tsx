import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                티
              </div>
              <span className="font-bold text-lg">티어차트 계급도</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              모든 제품의 계급도 큐레이션 플랫폼
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">👟 러닝화</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/running-shoes/tier" className="hover:text-foreground transition-colors">
                  계급도 보기
                </Link>
              </li>
              <li>
                <Link href="/running-shoes/quiz" className="hover:text-foreground transition-colors">
                  3분 진단
                </Link>
              </li>
              <li>
                <Link href="/running-shoes/compare" className="hover:text-foreground transition-colors">
                  VS 비교
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">🍗 치킨</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/chicken/tier" className="hover:text-foreground transition-colors">
                  계급도 보기
                </Link>
              </li>
              <li>
                <Link href="/chicken/quiz" className="hover:text-foreground transition-colors">
                  3분 진단
                </Link>
              </li>
              <li>
                <Link href="/chicken/compare" className="hover:text-foreground transition-colors">
                  VS 비교
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">정보</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 티어차트 계급도. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
