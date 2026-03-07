# 도메인 연결 가이드 — tier-chart.com

Cloudflare에서 구매한 `tier-chart.com`을 Vercel(프론트엔드) + Railway(백엔드)에 연결하는 방법.

## 구조

```
tier-chart.com         → Vercel (Next.js 프론트엔드)
api.tier-chart.com     → Railway (Django 백엔드)
```

---

## 1단계: Vercel에 커스텀 도메인 추가

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. `gyegeupdo_frontend` 프로젝트 클릭
3. 상단 탭에서 **Settings** 클릭
4. 왼쪽 메뉴에서 **Domains** 클릭
5. 입력창에 `tier-chart.com` 입력 → **Add** 클릭
6. `www.tier-chart.com`도 추가할지 물어보면 **Add** (www → tier-chart.com 리다이렉트 설정)
7. Vercel이 DNS 레코드 정보를 보여줌 — **이 값을 메모** (아래와 비슷한 형태):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

> Vercel이 보여주는 실제 값을 사용하세요. 위는 예시입니다.

---

## 2단계: Railway에 커스텀 도메인 추가

1. [Railway 대시보드](https://railway.app/dashboard) 접속
2. `gyegeupdo_backend` 프로젝트 클릭
3. 백엔드 서비스(Django) 클릭
4. **Settings** 탭 클릭
5. **Networking** 섹션에서 **Custom Domain** 클릭
6. `api.tier-chart.com` 입력 → **Add** 클릭
7. Railway가 CNAME 레코드 정보를 보여줌 — **이 값을 메모**:

```
Type: CNAME
Name: api
Value: <프로젝트명>.up.railway.app   (Railway가 알려주는 값)
```

---

## 3단계: Cloudflare DNS 설정

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 접속
2. `tier-chart.com` 도메인 클릭
3. 왼쪽 메뉴에서 **DNS** → **Records** 클릭
4. 아래 레코드들을 추가:

### 프론트엔드 (Vercel)

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| **A** | `@` | `76.76.21.21` (Vercel이 알려준 값) | **DNS only** (회색 구름) | Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` (Vercel이 알려준 값) | **DNS only** (회색 구름) | Auto |

### 백엔드 (Railway)

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| **CNAME** | `api` | Railway가 알려준 값 (예: `xxx.up.railway.app`) | **DNS only** (회색 구름) | Auto |

### 중요: Proxy 설정

> **반드시 "DNS only" (회색 구름 ☁️)로 설정하세요!**
>
> 주황색 구름 (Proxied)으로 하면 Vercel/Railway의 SSL 인증서 발급이 실패합니다.
>
> 레코드 추가 시 구름 아이콘을 클릭하면 회색/주황 전환됩니다.

### DNS 레코드 추가 방법 (상세)

1. **Add record** 버튼 클릭
2. Type 선택 (A 또는 CNAME)
3. Name에 `@` 또는 `www` 또는 `api` 입력
4. Content에 Vercel/Railway가 알려준 값 입력
5. **Proxy status** — 구름 아이콘 클릭하여 **회색 (DNS only)** 으로 변경
6. **Save** 클릭

---

## 4단계: SSL 설정 확인

### Cloudflare SSL 설정
1. Cloudflare 대시보드 → `tier-chart.com` → 왼쪽 메뉴 **SSL/TLS**
2. **Overview** 에서 모드를 **Full** 로 설정
   - "Full (strict)"가 아닌 **"Full"** 을 선택
   - DNS only 모드에서는 Vercel/Railway가 자체 SSL을 처리하므로 이 설정은 큰 영향 없지만, 만약 나중에 Proxy를 켜게 되면 필요

### Vercel SSL 확인
1. Vercel 대시보드 → Settings → Domains
2. `tier-chart.com` 옆에 초록색 체크마크 ✅ 가 나오면 SSL 발급 완료
3. 보통 DNS 설정 후 **5~30분** 소요

### Railway SSL 확인
1. Railway 대시보드 → Settings → Custom Domain
2. `api.tier-chart.com` 옆에 인증서 상태가 "Active"면 완료

---

## 5단계: 환경변수 업데이트

### Vercel 환경변수 (프론트엔드)

1. Vercel 대시보드 → Settings → **Environment Variables**
2. 아래 변수들을 추가/수정:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://tier-chart.com` |
| `NEXT_PUBLIC_API_URL` | `https://api.tier-chart.com/api/v1` |

3. **Save** 후 **Deployments** 탭에서 가장 최근 배포의 `...` 메뉴 → **Redeploy** 클릭

### Railway 환경변수 (백엔드)

1. Railway 대시보드 → 백엔드 서비스 → **Variables** 탭
2. 아래 변수를 추가/수정:

| Key | Value |
|-----|-------|
| `CORS_ALLOWED_ORIGINS` | `https://tier-chart.com,https://www.tier-chart.com` |
| `ALLOWED_HOSTS` | `api.tier-chart.com,<기존railway도메인>.up.railway.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://tier-chart.com,https://api.tier-chart.com` |

3. Railway는 변수 변경 시 자동으로 재배포됨

---

## 6단계: 확인

DNS 반영까지 **최대 24시간** 걸릴 수 있지만, 보통 **5~30분** 이면 됩니다.

### 확인 방법

```bash
# 1. DNS 전파 확인
nslookup tier-chart.com
nslookup api.tier-chart.com

# 2. 프론트엔드 확인
curl -I https://tier-chart.com

# 3. 백엔드 API 확인
curl -I https://api.tier-chart.com/api/v1/

# 4. 브라우저에서 직접 확인
# https://tier-chart.com 접속
```

### 체크리스트
- [ ] `https://tier-chart.com` 접속 시 프론트엔드 정상 표시
- [ ] `https://www.tier-chart.com` 접속 시 `tier-chart.com`으로 리다이렉트
- [ ] `https://api.tier-chart.com/api/v1/` 접속 시 백엔드 응답
- [ ] SSL 인증서 정상 (자물쇠 아이콘)
- [ ] 로그인/회원가입 정상 동작 (CORS)
- [ ] OG 이미지 공유 시 정상 표시

---

## 문제 해결

### "SSL 인증서 에러" 또는 "이 사이트에 연결할 수 없습니다"
→ Cloudflare DNS 레코드가 **Proxied (주황 구름)** 으로 되어 있는지 확인. **DNS only (회색 구름)** 으로 변경

### Vercel에서 도메인 옆에 빨간 에러
→ DNS 레코드 값이 정확한지 확인. Vercel Domains 페이지에서 안내하는 값과 Cloudflare에 입력한 값 비교

### API 호출 시 CORS 에러
→ Railway 환경변수에서 `CORS_ALLOWED_ORIGINS`에 `https://tier-chart.com` 이 포함되어 있는지 확인

### 페이지는 뜨는데 API 데이터가 안 나옴
→ Vercel 환경변수에서 `NEXT_PUBLIC_API_URL`이 `https://api.tier-chart.com/api/v1` 로 설정되어 있는지 확인. 설정 후 **Redeploy** 필수

---

## 요약 (한 눈에)

```
[Cloudflare DNS]
  tier-chart.com   → A    → 76.76.21.21 (Vercel)     [DNS only]
  www              → CNAME → cname.vercel-dns.com      [DNS only]
  api              → CNAME → xxx.up.railway.app         [DNS only]

[Vercel 환경변수]
  NEXT_PUBLIC_SITE_URL = https://tier-chart.com
  NEXT_PUBLIC_API_URL  = https://api.tier-chart.com/api/v1

[Railway 환경변수]
  CORS_ALLOWED_ORIGINS = https://tier-chart.com,https://www.tier-chart.com
  ALLOWED_HOSTS        = api.tier-chart.com,...
  CSRF_TRUSTED_ORIGINS = https://tier-chart.com,https://api.tier-chart.com
```
