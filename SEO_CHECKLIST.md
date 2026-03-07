# SEO 체크리스트 — 계급도 프론트엔드

## 완료된 작업

### SSR / 메타데이터
- [x] 모든 페이지 `generateMetadata` 또는 `export const metadata` 적용
- [x] root layout에 `title.template: '%s | 계급도'` 설정
- [x] title 중복 제거 (`| 계급도 | 계급도` → `| 계급도`)
- [x] `generateSeoMeta()` 헬퍼 — title은 layout template에 맡기고, OG/Twitter에만 `| 계급도` 포함
- [x] meta description 전 페이지 설정
- [x] SSR 콘텐츠 렌더링 확인 (크롤러가 HTML에서 콘텐츠 볼 수 있음)
- [x] `metadataBase` 설정 (`layout.tsx` — 빌드 경고 해결, OG 이미지 절대 URL)

### 구조화 데이터 / 크롤링
- [x] `robots.ts` — 크롤링 허용/차단 규칙 (login, signup, api 차단)
- [x] `sitemap.ts` — 주요 페이지 URL 자동 생성
- [x] JSON-LD `WebSite` 스키마 (layout.tsx)
- [x] `SearchAction` 포함 (사이트 검색 구조화 데이터)

### OpenGraph / 소셜 공유
- [x] OpenGraph 메타 태그 (title, description, url, siteName, locale, type)
- [x] Twitter Card 메타 태그 (summary_large_image)
- [x] 페이지별 동적 OG 태그 생성
- [x] `/api/og` 동적 OG 이미지 라우트 (기본, 티어, 나의 계급도, 퀴즈 결과 4종)
- [x] `public/og-image.png` 기본 OG 이미지 (1200x630)

### 코드 구조
- [x] `getMockPostMeta`를 'use client' 컴포넌트에서 분리 → `mockPosts.ts` (서버 컴포넌트 호환)
- [x] 서버 컴포넌트 페이지에서 안전하게 메타데이터 생성

### 페이지
- [x] `not-found.tsx` — 커스텀 404 페이지 (내부 링크 포함)
- [x] `error.tsx` / `global-error.tsx` — 에러 페이지

### 기타
- [x] `<html lang="ko">` 설정
- [x] canonical URL 설정 (`generateSeoMeta` → `alternates.canonical`)
- [x] `robots: { index: true, follow: true }` 기본 설정

---

## 남은 작업 (도메인 등록 전 가능)

### 높은 우선순위
- [ ] favicon / 앱 아이콘 — `public/favicon.ico`를 계급도 전용으로 교체, apple-touch-icon 추가
- [ ] sitemap에 치킨 카테고리 페이지들 추가
- [ ] sitemap에 게시글 상세 URL 추가 (`/running-shoes/board/1` ~ `7`, `/chicken/board/101` ~ `106`)

### 낮은 우선순위 (도메인 등록 후)
- [ ] Google Search Console 등록 및 sitemap 제출
- [ ] Naver Search Advisor 등록
- [ ] `metadataBase`를 실제 도메인으로 확인 (현재 `NEXT_PUBLIC_SITE_URL` 환경변수 사용)
- [ ] canonical URL 실 도메인 반영 확인
- [ ] OG 이미지 URL 실 도메인으로 동작 확인
- [ ] 페이지 속도 최적화 (Core Web Vitals)
- [ ] 구조화 데이터 추가 — `BreadcrumbList`, `Product`, `Review` 등

---

## 파일 위치 참고

| 파일 | 역할 |
|---|---|
| `src/app/layout.tsx` | 루트 메타데이터, metadataBase, title template, JSON-LD |
| `src/lib/seo.ts` | `generateSeoMeta()`, `generateModelSeo()` 헬퍼 |
| `src/lib/jsonLd.ts` | JSON-LD 구조화 데이터 생성 |
| `src/app/robots.ts` | 크롤러 규칙 |
| `src/app/sitemap.ts` | 사이트맵 생성 |
| `src/app/api/og/route.tsx` | 동적 OG 이미지 생성 (기본/티어/나의계급도/퀴즈결과) |
| `src/app/not-found.tsx` | 커스텀 404 페이지 |
| `src/app/(main)/[category]/board/[id]/mockPosts.ts` | 게시글 mock 데이터 (서버 컴포넌트 호환) |
| `public/og-image.png` | 기본 OG 공유 이미지 (1200x630) |
