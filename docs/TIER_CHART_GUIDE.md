# 계급도 데이터 구조 가이드라인

## 개요

이 문서는 계급도 플랫폼의 데이터 구조와 새 카테고리 추가 절차를 설명합니다.

---

## 1. 핵심 개념

### 1.1 계급도 유형

모든 계급도는 두 가지 뷰로 구성됩니다:

| 유형 | 설명 | 표시 대상 |
|------|------|----------|
| **브랜드 계급도** | 브랜드/프랜차이즈별 티어 | Brand 테이블 데이터 |
| **용도별 계급도** | 용도/상황별 제품 티어 | Product 테이블 데이터 (usage 필터링) |

### 1.2 티어 등급

| 티어 | 라벨 | 색상 | 설명 |
|------|------|------|------|
| S | 황제 | Gold (#FFD700) | 최상위 |
| A | 왕 | Purple (#9370DB) | 상위 |
| B | 양반 | Royal Blue (#4169E1) | 중상위 |
| C | 중인 | Green (#3CB371) | 중위 |
| D | 평민 | Brown (#8B7355) | 하위 |

**기본 표시 범위:** S~B (황제~양반)
**확장 표시 범위:** S~D (일부 카테고리)

---

## 2. 데이터베이스 구조

### 2.1 테이블 관계

```
Category (카테고리)
    ├── Brand (브랜드) ──────┐
    │   └── BrandScore      │
    │                        │
    └── Product (제품) ◄─────┘
        ├── ProductSpec
        └── ProductScore
```

### 2.2 올바른 데이터 예시

#### 러닝화 카테고리
- **Brand**: 나이키, 아식스, 호카, 뉴발란스 (브랜드)
- **Product**: 노바블라스트 4, 알파플라이 3, 클리프톤 9 (모델)

#### 치킨 카테고리
- **Brand**: BBQ, BHC, 교촌, 굽네, 네네 (프랜차이즈) ✅
- **Product**: 황금올리브치킨, 뿌링클, 교촌 오리지날 (메뉴) ✅

❌ **잘못된 예**: Brand에 메뉴명(황금올리브치킨)을 넣으면 안됨

#### 시계 카테고리
- **Brand**: 롤렉스, 오메가, 파텍필립 (브랜드)
- **Product**: 서브마리너, 스피드마스터, 노틸러스 (모델)

---

## 3. 프론트엔드 구조

### 3.1 중앙 설정 파일

**위치**: `src/config/categories.ts`

```typescript
// 카테고리 설정
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: 'running-shoes',
    name: '러닝화',
    icon: '👟',
    color: '#E94560',
    tierChart: {
      brandTiers: ['S', 'A', 'B'],      // 브랜드 계급도 티어 범위
      usageTiers: ['S', 'A', 'B'],      // 용도별 계급도 티어 범위
      brandLinkType: 'brand',           // 브랜드 클릭 시 이동 페이지
      brandLabel: '브랜드',             // UI에 표시할 라벨
      productLabel: '모델',
    },
  },
  // ...
];
```

### 3.2 링크 생성 함수

```typescript
import { getBrandHref, getProductHref } from '@/config/categories';

// 브랜드 클릭 시 URL
getBrandHref('running-shoes', 'nike'); // -> /running-shoes/brand/nike
getBrandHref('chicken', 'bbq');        // -> /chicken/brand/bbq

// 제품 클릭 시 URL
getProductHref('running-shoes', 'novablast-4'); // -> /running-shoes/model/novablast-4
```

---

## 4. 새 카테고리 추가 절차

### 4.1 백엔드 (Django)

1. **seed_categories.py 수정**
   ```python
   {
       'name': '새카테고리',
       'slug': 'new-category',
       'icon': '📦',
       # spec_definitions, score_definitions, brand_score_definitions 추가
   }
   ```

2. **seed_products.py에 데이터 추가** (필요시)

3. **마이그레이션 & 시드 실행**
   ```bash
   python manage.py seed_categories
   python manage.py seed_products
   ```

### 4.2 프론트엔드 (Next.js)

1. **src/config/categories.ts에 설정 추가**
   ```typescript
   {
     slug: 'new-category',
     name: '새카테고리',
     icon: '📦',
     color: '#000000',
     tierChart: {
       brandTiers: DEFAULT_BRAND_TIERS,
       usageTiers: DEFAULT_BRAND_TIERS,
       brandLinkType: 'brand',
       brandLabel: '브랜드',
       productLabel: '제품',
     },
   }
   ```

2. **그 외 수정 불필요** (중앙 설정 참조)

---

## 5. 하드코딩 금지 규칙

### 5.1 금지 패턴

```typescript
// ❌ 금지: 카테고리별 조건문
if (category === 'chicken') {
  // ...
} else if (category === 'running-shoes') {
  // ...
}

// ❌ 금지: 직접 링크 생성
const href = `/${category}/model/${slug}`;
```

### 5.2 권장 패턴

```typescript
// ✅ 권장: 중앙 설정 사용
import { getCategoryConfig, getBrandHref } from '@/config/categories';

const config = getCategoryConfig(category);
const href = getBrandHref(category, brand.slug);
const label = config?.tierChart.brandLabel ?? '브랜드';
```

---

## 6. 데이터 싱크 원칙

### 6.1 데이터 소스 우선순위

1. **백엔드 API** (최우선)
2. **중앙 설정 파일** (fallback 설정)
3. **Mock 데이터** (개발 환경 전용)

### 6.2 중복 방지

- Mock 데이터는 백엔드 API 실패 시에만 사용
- 동일 데이터를 여러 파일에 정의하지 않음
- 카테고리 설정은 `src/config/categories.ts`에서만 정의

---

## 7. 용도별 계급도 (Usage Tier)

### 7.1 데이터 구조

용도별 계급도는 Product의 `usage` 필드로 필터링됩니다.

```typescript
// Product 모델
{
  name: '노바블라스트 4',
  usage: 'daily',  // 용도: daily, race, beginner 등
  // ...
}
```

### 7.2 용도 정의

Category의 `filter_definitions.usage`에 정의:

```json
{
  "usage": [
    { "label": "데일리", "value": "daily" },
    { "label": "레이스", "value": "race" },
    { "label": "입문", "value": "beginner" }
  ]
}
```

---

## 8. Mock 데이터 구조 (프론트엔드)

### 8.1 파일 위치
**`src/lib/mockData.ts`**

### 8.2 브랜드 vs 제품 데이터 분리

```typescript
// 브랜드(프랜차이즈) 데이터 - 브랜드 계급도용
export const CHICKEN_BRANDS: Brand[] = [
  { name: 'BBQ', slug: 'bbq', tier: 'S', ... },
  { name: 'BHC', slug: 'bhc', tier: 'S', ... },
];

// 제품(메뉴) 데이터 - 용도별 계급도용
export const CHICKEN_MENUS: Brand[] = [
  { name: '황금올리브치킨', slug: 'bbq-golden-olive', brand_name: 'BBQ', ... },
  { name: '뿌링클', slug: 'bhc-puringkle', brand_name: 'BHC', ... },
];

// 브랜드 데이터 반환 함수
export function getMockBrands(category: string): Brand[] | null {
  if (category === 'chicken') return CHICKEN_BRANDS;  // ✅ 프랜차이즈 반환
  // ...
}

// 제품 데이터 반환 함수
export function getMockProducts(category: string): Brand[] | null {
  if (category === 'chicken') return CHICKEN_MENUS;  // ✅ 메뉴 반환
  // ...
}
```

### 8.3 주의사항

- **브랜드 계급도**: `getMockBrands()` 사용 (프랜차이즈/브랜드)
- **용도별 계급도**: `getMockProducts()` 사용 (메뉴/모델)
- 백엔드 `seed_categories.py`의 브랜드 목록과 동기화 필요

---

## 9. UI 스타일 가이드

### 9.1 TierMaker 스타일 통일

브랜드 계급도와 용도별 계급도는 동일한 UI 스타일을 사용합니다:

```
┌─────────┬────────────────────────────────────────┐
│  황제   │ [BBQ] [BHC] [교촌치킨]                   │
├─────────┼────────────────────────────────────────┤
│   왕    │ [굽네치킨] [네네치킨] [푸라닭]           │
├─────────┼────────────────────────────────────────┤
│  양반   │ [호식이] [처갓집] [60계치킨] [KFC]      │
└─────────┴────────────────────────────────────────┘
```

### 9.2 티어 색상 (단색)

| 티어 | 라벨 | 색상 코드 |
|------|------|-----------|
| S | 황제 | `#FFD700` (Gold) |
| A | 왕 | `#9370DB` (Purple) |
| B | 양반 | `#4169E1` (Royal Blue) |
| C | 중인 | `#3CB371` (Green) |
| D | 평민 | `#8B7355` (Brown) |

### 9.3 텍스트 색상

- **S티어 (황제)**: `text-black` (골드 배경)
- **A~D티어**: `text-white` (어두운 배경)

---

## 10. 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-03-09 | 초안 작성, 중앙 설정 파일 도입 |
| 2026-03-09 | Mock 데이터 구조 추가 (브랜드/제품 분리), UI 스타일 가이드 추가 |

---

*Last Updated: 2026-03-09*
