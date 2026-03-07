# 검색엔진 등록 가이드 — tier-chart.com

Google Search Console + Naver Search Advisor 등록 및 sitemap 제출 가이드.

---

## 1. Google Search Console 등록

### 1-1. 접속 및 속성 추가

1. [Google Search Console](https://search.google.com/search-console) 접속 (Google 계정 로그인)
2. 왼쪽 상단 속성 선택 드롭다운 → **속성 추가**
3. **URL 접두어** 방식 선택
4. `https://tier-chart.com` 입력 → **계속**

### 1-2. 소유권 확인 (DNS 방식 — 추천)

여러 확인 방법 중 **DNS 레코드** 방식이 가장 간단합니다:

1. Google이 보여주는 **TXT 레코드 값**을 복사 (예: `google-site-verification=xxxx...`)
2. [Cloudflare 대시보드](https://dash.cloudflare.com) → `tier-chart.com` → **DNS** → **Records**
3. **Add record**:

| Type | Name | Content | TTL |
|------|------|---------|-----|
| **TXT** | `@` | Google이 제공한 값 | Auto |

4. Cloudflare에서 Save 후 **Google Search Console로 돌아가서 확인 클릭**
5. DNS 전파에 몇 분 걸릴 수 있음 → 실패하면 5분 후 재시도

### 1-3. Sitemap 제출

1. 소유권 확인 완료 후, 왼쪽 메뉴에서 **Sitemaps** (색인 > 사이트맵)
2. 새 사이트맵 추가에 `sitemap.xml` 입력
3. **제출** 클릭
4. 상태가 **성공** 으로 바뀌면 완료

> 사이트맵 URL: `https://tier-chart.com/sitemap.xml`

### 1-4. 확인 사항

- 왼쪽 메뉴 **URL 검사** → `https://tier-chart.com` 입력하여 색인 상태 확인
- **색인 생성 요청** 클릭하면 크롤링 우선순위를 높일 수 있음
- 주요 페이지들도 개별적으로 색인 요청 가능:
  - `https://tier-chart.com/running-shoes`
  - `https://tier-chart.com/running-shoes/tier`
  - `https://tier-chart.com/chicken`

---

## 2. Naver Search Advisor 등록

### 2-1. 접속 및 사이트 추가

1. [Naver Search Advisor](https://searchadvisor.naver.com/) 접속 (네이버 계정 로그인)
2. 상단 **웹마스터 도구** 클릭
3. 사이트 등록 입력창에 `https://tier-chart.com` 입력 → **추가**

### 2-2. 소유권 확인 (HTML 태그 방식)

1. 소유확인 방법 중 **HTML 태그** 선택
2. 네이버가 보여주는 메타 태그를 복사:
   ```html
   <meta name="naver-site-verification" content="xxxxxxxxxxxxxxx" />
   ```
3. 이 값을 Next.js 코드에 추가해야 합니다

### 2-3. 코드에 네이버 인증 태그 추가

`src/app/layout.tsx` 의 metadata에 추가:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tier-chart.com'),
  verification: {
    google: 'Google에서 받은 값',       // Google도 여기에 추가 가능
    other: {
      'naver-site-verification': ['네이버에서 받은 값'],
    },
  },
  // ... 기존 설정
};
```

> 이 방법을 사용하면 DNS TXT 대신 HTML 메타태그로 소유권을 확인합니다.
> Google도 DNS 대신 이 방식을 사용할 수 있습니다.

4. 코드 수정 후 push → Vercel 자동 배포
5. 배포 완료 후 네이버 소유확인 페이지에서 **확인** 클릭

### 2-4. Sitemap 제출

1. 소유권 확인 완료 후, **요청** → **사이트맵 제출**
2. `https://tier-chart.com/sitemap.xml` 입력 → **확인**

### 2-5. RSS 제출 (선택)

네이버는 RSS도 지원합니다. 현재 RSS가 없으므로 나중에 블로그/게시판 RSS를 만들면 추가 제출 가능.

### 2-6. 확인 사항

- **사이트 진단** 메뉴에서 크롤링 상태 확인
- 네이버 검색 로봇이 사이트 정보를 수집하는 데 **2~4주** 소요
- **웹 페이지 수집 요청**으로 주요 페이지 크롤링 요청 가능

---

## 3. 실행 순서 요약

```
[Step 1] Google Search Console
  ① 속성 추가 (URL 접두어: https://tier-chart.com)
  ② 소유권 확인 (DNS TXT 레코드를 Cloudflare에 추가)
  ③ Sitemap 제출 (sitemap.xml)
  ④ 주요 페이지 색인 요청

[Step 2] Naver Search Advisor
  ① 사이트 추가 (https://tier-chart.com)
  ② 소유권 확인 (HTML 메타태그를 layout.tsx에 추가 → 배포)
  ③ Sitemap 제출 (sitemap.xml)

[Step 3] 코드 수정 (한 번에 처리)
  ① layout.tsx에 verification 메타데이터 추가
  ② git push → Vercel 자동 배포
  ③ Google/Naver 소유확인 완료
```

---

## 4. 등록 후 모니터링

### Google Search Console
- **실적** — 검색 노출수, 클릭수, 평균 순위
- **적용 범위** — 색인된 페이지 수, 오류 페이지
- **경험** — Core Web Vitals (페이지 속도)
- **링크** — 외부/내부 링크 현황

### Naver Search Advisor
- **사이트 진단** — 크롤링 상태, SEO 점수
- **콘텐츠 확산** — 네이버 검색 노출 현황
- **웹 페이지 최적화** — 개선 권장 사항

---

## 5. 추가 검색엔진 (선택)

### Bing Webmaster Tools
1. [Bing Webmaster](https://www.bing.com/webmasters) 접속
2. Google Search Console 계정을 연동하면 자동으로 설정 가능
3. sitemap 제출

### Daum / Zum
- Daum은 별도 웹마스터 도구 없음 (네이버 등록하면 자연스럽게 노출)
- Zum은 [ZUM 검색등록](https://register.zum.com)에서 등록 가능

---

## 참고 링크

- [Google Search Console](https://search.google.com/search-console)
- [Google Search Console 시작 가이드](https://support.google.com/webmasters/answer/10267942?hl=ko)
- [Naver Search Advisor](https://searchadvisor.naver.com/)
- [네이버 서치어드바이저 등록 가이드](https://seo.tbwakorea.com/blog/naver-search-advisor/)
- 사이트맵: `https://tier-chart.com/sitemap.xml`
- Robots: `https://tier-chart.com/robots.txt`
