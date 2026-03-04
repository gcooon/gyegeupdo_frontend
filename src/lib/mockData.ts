import type { Brand, Category } from '@/types/model';
import type { TierLevel } from '@/lib/tier';

// 브랜드 로고 URL 생성 함수 (플레이스홀더)
const getBrandLogoUrl = (brandName: string, bgColor: string = '1A1A2E') => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=${bgColor}&color=fff&size=128&font-size=0.4&bold=true`;
};

// 런닝화 브랜드 Mock 데이터
export const RUNNING_SHOES_BRANDS: Brand[] = [
  // S티어 - 최고 브랜드
  {
    id: 1,
    name: '아식스',
    slug: 'asics',
    logo_url: getBrandLogoUrl('ASICS', 'E94560'),
    tier: 'S' as TierLevel,
    tier_score: 95.0,
    description: '일본의 러닝화 명가, 젤 쿠셔닝 기술의 선두주자',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 96 },
      { key: 'tech', label: '기술력', value: 97 },
      { key: 'durability', label: '내구성', value: 95 },
      { key: 'community', label: '커뮤니티', value: 92 },
    ],
  },
  {
    id: 2,
    name: '나이키',
    slug: 'nike',
    logo_url: getBrandLogoUrl('NIKE', '000000'),
    tier: 'S' as TierLevel,
    tier_score: 94.0,
    description: '세계 최대 스포츠 브랜드, 혁신적인 기술력',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 98 },
      { key: 'tech', label: '기술력', value: 96 },
      { key: 'durability', label: '내구성', value: 88 },
      { key: 'community', label: '커뮤니티', value: 95 },
    ],
  },
  {
    id: 3,
    name: '호카',
    slug: 'hoka',
    logo_url: getBrandLogoUrl('HOKA', '1E40AF'),
    tier: 'S' as TierLevel,
    tier_score: 92.5,
    description: '맥시멀 쿠셔닝의 혁명, 편안함의 대명사',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 88 },
      { key: 'tech', label: '기술력', value: 94 },
      { key: 'durability', label: '내구성', value: 90 },
      { key: 'community', label: '커뮤니티', value: 96 },
    ],
  },
  // A티어 - 우수 브랜드
  {
    id: 4,
    name: '뉴발란스',
    slug: 'new-balance',
    logo_url: getBrandLogoUrl('NB', 'DC143C'),
    tier: 'A' as TierLevel,
    tier_score: 88.0,
    description: '프레시폼 기술의 선두, 안정성과 편안함',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 90 },
      { key: 'tech', label: '기술력', value: 88 },
      { key: 'durability', label: '내구성', value: 89 },
      { key: 'community', label: '커뮤니티', value: 85 },
    ],
  },
  {
    id: 5,
    name: '써코니',
    slug: 'saucony',
    logo_url: getBrandLogoUrl('SAUCONY', '4169E1'),
    tier: 'A' as TierLevel,
    tier_score: 87.0,
    description: '러너들의 러너, PWRRUN 쿠셔닝 기술',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 85 },
      { key: 'tech', label: '기술력', value: 90 },
      { key: 'durability', label: '내구성', value: 88 },
      { key: 'community', label: '커뮤니티', value: 84 },
    ],
  },
  {
    id: 6,
    name: '브룩스',
    slug: 'brooks',
    logo_url: getBrandLogoUrl('BROOKS', '1C4587'),
    tier: 'A' as TierLevel,
    tier_score: 86.5,
    description: 'DNA 쿠셔닝 기술, 안정화의 명가',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 84 },
      { key: 'tech', label: '기술력', value: 89 },
      { key: 'durability', label: '내구성', value: 91 },
      { key: 'community', label: '커뮤니티', value: 80 },
    ],
  },
  {
    id: 7,
    name: '아디다스',
    slug: 'adidas',
    logo_url: getBrandLogoUrl('adidas', '000000'),
    tier: 'A' as TierLevel,
    tier_score: 85.5,
    description: '부스트 폼의 원조, 독일 스포츠 명가',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 92 },
      { key: 'tech', label: '기술력', value: 86 },
      { key: 'durability', label: '내구성', value: 82 },
      { key: 'community', label: '커뮤니티', value: 83 },
    ],
  },
  // B티어 - 준수한 브랜드
  {
    id: 8,
    name: '미즈노',
    slug: 'mizuno',
    logo_url: getBrandLogoUrl('MIZUNO', '003366'),
    tier: 'B' as TierLevel,
    tier_score: 82.0,
    description: '웨이브 플레이트 기술, 일본 장인 정신',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 78 },
      { key: 'tech', label: '기술력', value: 85 },
      { key: 'durability', label: '내구성', value: 88 },
      { key: 'community', label: '커뮤니티', value: 76 },
    ],
  },
  {
    id: 9,
    name: '푸마',
    slug: 'puma',
    logo_url: getBrandLogoUrl('PUMA', '000000'),
    tier: 'B' as TierLevel,
    tier_score: 79.0,
    description: '나이트로 폼 기술, 가성비 좋은 선택',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 82 },
      { key: 'tech', label: '기술력', value: 78 },
      { key: 'durability', label: '내구성', value: 76 },
      { key: 'community', label: '커뮤니티', value: 80 },
    ],
  },
  {
    id: 10,
    name: '언더아머',
    slug: 'under-armour',
    logo_url: getBrandLogoUrl('UA', '1A1A1A'),
    tier: 'B' as TierLevel,
    tier_score: 77.5,
    description: 'HOVR 기술, 에너지 리턴에 강점',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 75 },
      { key: 'tech', label: '기술력', value: 80 },
      { key: 'durability', label: '내구성', value: 78 },
      { key: 'community', label: '커뮤니티', value: 77 },
    ],
  },
  {
    id: 11,
    name: '리복',
    slug: 'reebok',
    logo_url: getBrandLogoUrl('REEBOK', 'CC0000'),
    tier: 'B' as TierLevel,
    tier_score: 75.0,
    description: '플로트라이드 기술, 합리적인 가격',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 72 },
      { key: 'tech', label: '기술력', value: 76 },
      { key: 'durability', label: '내구성', value: 78 },
      { key: 'community', label: '커뮤니티', value: 74 },
    ],
  },
  {
    id: 12,
    name: '온러닝',
    slug: 'on-running',
    logo_url: getBrandLogoUrl('On', '000000'),
    tier: 'A' as TierLevel,
    tier_score: 86.0,
    description: '클라우드텍 기술, 스위스 프리미엄',
    category: 'running-shoes',
    scores: [
      { key: 'lineup', label: '라인업', value: 82 },
      { key: 'tech', label: '기술력', value: 91 },
      { key: 'durability', label: '내구성', value: 84 },
      { key: 'community', label: '커뮤니티', value: 87 },
    ],
  },
];

// 런닝화 카테고리 정보
export const RUNNING_SHOES_CATEGORY: Category = {
  id: 1,
  slug: 'running-shoes',
  name: '러닝화',
  description: '러닝화 브랜드 계급도 - 커뮤니티 리뷰 기반',
  icon: '👟',
  display_order: 1,
  is_active: true,
  spec_definitions: [
    { key: 'weight', label: '무게', unit: 'g', type: 'number' },
    { key: 'stack_height', label: '스택 높이', unit: 'mm', type: 'number' },
    { key: 'drop', label: '드롭', unit: 'mm', type: 'number' },
    { key: 'upper', label: '어퍼 소재', type: 'text' },
    { key: 'midsole', label: '미드솔', type: 'text' },
  ],
  score_definitions: [
    { key: 'cushion', label: '쿠셔닝', weight: 25 },
    { key: 'responsiveness', label: '반응성', weight: 25 },
    { key: 'stability', label: '안정성', weight: 25 },
    { key: 'durability', label: '내구성', weight: 25 },
  ],
  brand_score_definitions: [
    { key: 'lineup', label: '라인업 점수', weight: 25 },
    { key: 'tech', label: '기술력 점수', weight: 30 },
    { key: 'durability', label: '내구성 점수', weight: 25 },
    { key: 'community', label: '커뮤니티 점수', weight: 20 },
  ],
  filter_definitions: {
    product_type: [
      { value: 'cushion', label: '쿠션화' },
      { value: 'stability', label: '안정화' },
      { value: 'racing', label: '레이싱화' },
    ],
    usage: [
      { value: 'daily', label: '데일리 러닝' },
      { value: 'long', label: '장거리' },
      { value: 'race', label: '레이스' },
    ],
  },
  quiz_definitions: [
    {
      key: 'budget',
      question: '예산은 어느 정도인가요?',
      emoji: '💰',
      options: [
        { value: 'low', label: '10만원 이하', description: '가성비 중시' },
        { value: 'mid', label: '10-20만원', description: '적당한 투자' },
        { value: 'high', label: '20만원 이상', description: '최고급 제품' },
      ],
    },
    {
      key: 'usage',
      question: '주로 어떤 용도로 사용하시나요?',
      emoji: '🏃',
      options: [
        { value: 'beginner', label: '입문/취미', description: '가볍게 달리기' },
        { value: 'daily', label: '일상 훈련', description: '꾸준한 러닝' },
        { value: 'race', label: '대회/레이스', description: '기록 도전' },
      ],
    },
    {
      key: 'foot_type',
      question: '발 모양은 어떤가요?',
      emoji: '🦶',
      options: [
        { value: 'flat', label: '평발', description: '아치가 낮음' },
        { value: 'normal', label: '보통', description: '일반적인 아치' },
        { value: 'high', label: '요족', description: '아치가 높음' },
      ],
    },
    {
      key: 'priority',
      question: '가장 중요하게 생각하는 것은?',
      emoji: '⭐',
      options: [
        { value: 'cushion', label: '쿠셔닝', description: '편안함 우선' },
        { value: 'speed', label: '경량성', description: '빠른 속도' },
        { value: 'stability', label: '안정성', description: '부상 방지' },
      ],
    },
  ],
};

// 치킨 브랜드 로고 맵
const CHICKEN_BRAND_LOGOS: Record<string, string> = {
  'BBQ': getBrandLogoUrl('BBQ', 'B8860B'),
  '교촌': getBrandLogoUrl('교촌', 'C41E3A'),
  'BHC': getBrandLogoUrl('BHC', 'FF6B00'),
  '굽네': getBrandLogoUrl('굽네', '8B4513'),
  '네네': getBrandLogoUrl('네네', 'FFD700'),
  '푸라닭': getBrandLogoUrl('푸라닭', '000000'),
  '처갓집': getBrandLogoUrl('처갓집', 'DC143C'),
  '페리카나': getBrandLogoUrl('페리카나', 'FF4500'),
  '호식이': getBrandLogoUrl('호식이', '228B22'),
  '멕시카나': getBrandLogoUrl('멕시카나', 'FFD700'),
};

// 치킨 메뉴 Mock 데이터 (브랜드별 대표 메뉴)
export const CHICKEN_MENUS: Brand[] = [
  // S티어 - 최고 인기 메뉴
  {
    id: 101,
    name: '황금올리브치킨',
    slug: 'bbq-golden-olive',
    logo_url: CHICKEN_BRAND_LOGOS['BBQ'],
    brand_name: 'BBQ',
    tier: 'S' as TierLevel,
    tier_score: 94.5,
    description: 'BBQ의 시그니처 메뉴, 올리브유로 튀긴 바삭한 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 96 },
      { key: 'price', label: '가성비', value: 88 },
      { key: 'crispy', label: '바삭함', value: 95 },
      { key: 'popularity', label: '인기도', value: 98 },
    ],
  },
  {
    id: 102,
    name: '교촌 오리지날',
    slug: 'kyochon-original',
    logo_url: CHICKEN_BRAND_LOGOS['교촌'],
    brand_name: '교촌',
    tier: 'S' as TierLevel,
    tier_score: 93.0,
    description: '교촌치킨의 간장 소스 오리지널 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 95 },
      { key: 'price', label: '가성비', value: 85 },
      { key: 'crispy', label: '바삭함', value: 90 },
      { key: 'popularity', label: '인기도', value: 96 },
    ],
  },
  {
    id: 103,
    name: '뿌링클',
    slug: 'bhc-puringkle',
    logo_url: CHICKEN_BRAND_LOGOS['BHC'],
    brand_name: 'BHC',
    tier: 'S' as TierLevel,
    tier_score: 92.5,
    description: 'BHC의 치즈 시즈닝 치킨, MZ세대 인기',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 94 },
      { key: 'price', label: '가성비', value: 86 },
      { key: 'crispy', label: '바삭함', value: 92 },
      { key: 'popularity', label: '인기도', value: 97 },
    ],
  },
  // A티어 - 우수 메뉴
  {
    id: 104,
    name: '교촌 레드',
    slug: 'kyochon-red',
    logo_url: CHICKEN_BRAND_LOGOS['교촌'],
    brand_name: '교촌',
    tier: 'A' as TierLevel,
    tier_score: 88.5,
    description: '교촌의 매콤한 양념 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 90 },
      { key: 'price', label: '가성비', value: 84 },
      { key: 'crispy', label: '바삭함', value: 88 },
      { key: 'popularity', label: '인기도', value: 91 },
    ],
  },
  {
    id: 105,
    name: '굽네 고추바사삭',
    slug: 'goobne-gochu',
    logo_url: CHICKEN_BRAND_LOGOS['굽네'],
    brand_name: '굽네',
    tier: 'A' as TierLevel,
    tier_score: 87.0,
    description: '굽네의 오븐구이 매콤 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 89 },
      { key: 'price', label: '가성비', value: 82 },
      { key: 'crispy', label: '바삭함', value: 86 },
      { key: 'popularity', label: '인기도', value: 90 },
    ],
  },
  {
    id: 106,
    name: '네네 스노윙',
    slug: 'nene-snowing',
    logo_url: CHICKEN_BRAND_LOGOS['네네'],
    brand_name: '네네',
    tier: 'A' as TierLevel,
    tier_score: 86.5,
    description: '네네치킨의 눈꽃 치즈 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 88 },
      { key: 'price', label: '가성비', value: 83 },
      { key: 'crispy', label: '바삭함', value: 85 },
      { key: 'popularity', label: '인기도', value: 89 },
    ],
  },
  {
    id: 107,
    name: '푸라닭 블랙알리오',
    slug: 'puradak-black-allio',
    logo_url: CHICKEN_BRAND_LOGOS['푸라닭'],
    brand_name: '푸라닭',
    tier: 'A' as TierLevel,
    tier_score: 86.0,
    description: '푸라닭의 마늘 풍미 프리미엄 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 90 },
      { key: 'price', label: '가성비', value: 75 },
      { key: 'crispy', label: '바삭함', value: 88 },
      { key: 'popularity', label: '인기도', value: 88 },
    ],
  },
  {
    id: 108,
    name: 'BBQ 자메이카 통다리',
    slug: 'bbq-jamaica',
    logo_url: CHICKEN_BRAND_LOGOS['BBQ'],
    brand_name: 'BBQ',
    tier: 'A' as TierLevel,
    tier_score: 85.5,
    description: 'BBQ의 저크 시즈닝 통다리 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 87 },
      { key: 'price', label: '가성비', value: 80 },
      { key: 'crispy', label: '바삭함', value: 86 },
      { key: 'popularity', label: '인기도', value: 88 },
    ],
  },
  {
    id: 109,
    name: '맛초킹',
    slug: 'bhc-matchoking',
    logo_url: CHICKEN_BRAND_LOGOS['BHC'],
    brand_name: 'BHC',
    tier: 'A' as TierLevel,
    tier_score: 85.0,
    description: 'BHC의 매콤달콤 양념 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 87 },
      { key: 'price', label: '가성비', value: 82 },
      { key: 'crispy', label: '바삭함', value: 84 },
      { key: 'popularity', label: '인기도', value: 86 },
    ],
  },
  // B티어 - 준수한 메뉴
  {
    id: 110,
    name: '굽네 볼케이노',
    slug: 'goobne-volcano',
    logo_url: CHICKEN_BRAND_LOGOS['굽네'],
    brand_name: '굽네',
    tier: 'B' as TierLevel,
    tier_score: 82.0,
    description: '굽네의 매운맛 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 84 },
      { key: 'price', label: '가성비', value: 80 },
      { key: 'crispy', label: '바삭함', value: 82 },
      { key: 'popularity', label: '인기도', value: 82 },
    ],
  },
  {
    id: 111,
    name: '처갓집 슈프림양념',
    slug: 'cheogajip-supreme',
    logo_url: CHICKEN_BRAND_LOGOS['처갓집'],
    brand_name: '처갓집',
    tier: 'B' as TierLevel,
    tier_score: 80.5,
    description: '처갓집의 대표 양념 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 82 },
      { key: 'price', label: '가성비', value: 85 },
      { key: 'crispy', label: '바삭함', value: 78 },
      { key: 'popularity', label: '인기도', value: 78 },
    ],
  },
  {
    id: 112,
    name: '페리카나 양념치킨',
    slug: 'pelicana-yangnyum',
    logo_url: CHICKEN_BRAND_LOGOS['페리카나'],
    brand_name: '페리카나',
    tier: 'B' as TierLevel,
    tier_score: 79.5,
    description: '페리카나의 클래식 양념 치킨',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 81 },
      { key: 'price', label: '가성비', value: 84 },
      { key: 'crispy', label: '바삭함', value: 76 },
      { key: 'popularity', label: '인기도', value: 77 },
    ],
  },
  {
    id: 113,
    name: '호식이 후라이드',
    slug: 'hosigi-fried',
    logo_url: CHICKEN_BRAND_LOGOS['호식이'],
    brand_name: '호식이',
    tier: 'B' as TierLevel,
    tier_score: 78.0,
    description: '호식이의 가성비 후라이드',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 78 },
      { key: 'price', label: '가성비', value: 95 },
      { key: 'crispy', label: '바삭함', value: 75 },
      { key: 'popularity', label: '인기도', value: 72 },
    ],
  },
  {
    id: 114,
    name: '멕시카나 반반치킨',
    slug: 'mexicana-half',
    logo_url: CHICKEN_BRAND_LOGOS['멕시카나'],
    brand_name: '멕시카나',
    tier: 'B' as TierLevel,
    tier_score: 77.0,
    description: '멕시카나의 후라이드+양념 조합',
    category: 'chicken',
    scores: [
      { key: 'taste', label: '맛', value: 78 },
      { key: 'price', label: '가성비', value: 82 },
      { key: 'crispy', label: '바삭함', value: 76 },
      { key: 'popularity', label: '인기도', value: 73 },
    ],
  },
];

// 치킨 카테고리 정보
export const CHICKEN_CATEGORY: Category = {
  id: 2,
  slug: 'chicken',
  name: '치킨',
  description: '대한민국 치킨 메뉴 계급도',
  icon: '🍗',
  display_order: 2,
  is_active: true,
  spec_definitions: [
    { key: 'brand', label: '브랜드', type: 'text' },
    { key: 'price', label: '가격', unit: '원', type: 'number' },
    { key: 'type', label: '조리방식', type: 'select', options: [
      { value: 'fried', label: '후라이드' },
      { value: 'seasoned', label: '양념' },
      { value: 'roasted', label: '구이' },
    ]},
  ],
  score_definitions: [
    { key: 'taste', label: '맛', weight: 35 },
    { key: 'price', label: '가성비', weight: 25 },
    { key: 'crispy', label: '바삭함', weight: 20 },
    { key: 'popularity', label: '인기도', weight: 20 },
  ],
  brand_score_definitions: [
    { key: 'taste', label: '맛', weight: 35 },
    { key: 'price', label: '가성비', weight: 25 },
    { key: 'crispy', label: '바삭함', weight: 20 },
    { key: 'popularity', label: '인기도', weight: 20 },
  ],
  filter_definitions: {
    product_type: [
      { value: 'fried', label: '후라이드' },
      { value: 'seasoned', label: '양념' },
      { value: 'roasted', label: '구이' },
    ],
    usage: [
      { value: 'alone', label: '혼닭' },
      { value: 'party', label: '파티' },
      { value: 'meal', label: '식사 대용' },
    ],
  },
  quiz_definitions: [
    {
      key: 'flavor',
      question: '어떤 맛을 좋아하시나요?',
      emoji: '👅',
      options: [
        { value: 'original', label: '담백한 후라이드', description: '치킨 본연의 맛' },
        { value: 'sweet', label: '달콤한 양념', description: '달콤짭짤한 맛' },
        { value: 'spicy', label: '매콤한 맛', description: '칼칼하게 매운 맛' },
        { value: 'garlic', label: '마늘/간장 맛', description: '감칠맛 나는 풍미' },
      ],
    },
    {
      key: 'occasion',
      question: '어떤 상황에서 먹으시나요?',
      emoji: '🎉',
      options: [
        { value: 'alone', label: '혼자 먹을 때', description: '혼닭 타임' },
        { value: 'couple', label: '연인/친구와', description: '2~3명이서' },
        { value: 'party', label: '모임/파티', description: '여러 명이 함께' },
        { value: 'meal', label: '식사 대용', description: '든든한 한 끼' },
      ],
    },
    {
      key: 'drink',
      question: '함께 마실 음료는?',
      emoji: '🍺',
      options: [
        { value: 'beer', label: '맥주', description: '치맥은 진리' },
        { value: 'soju', label: '소주', description: '치소도 좋지' },
        { value: 'coke', label: '콜라/사이다', description: '탄산과 함께' },
        { value: 'none', label: '음료 없이', description: '치킨만으로 충분' },
      ],
    },
    {
      key: 'texture',
      question: '선호하는 식감은?',
      emoji: '✨',
      options: [
        { value: 'crispy', label: '바삭바삭', description: '크리스피한 튀김옷' },
        { value: 'juicy', label: '촉촉한 육즙', description: '부드러운 살코기' },
        { value: 'chewy', label: '쫄깃한 식감', description: '씹는 맛이 있는' },
        { value: 'any', label: '상관없음', description: '맛있으면 OK' },
      ],
    },
    {
      key: 'price',
      question: '예산은 어느 정도인가요?',
      emoji: '💰',
      options: [
        { value: 'cheap', label: '2만원 이하', description: '가성비 최고' },
        { value: 'normal', label: '2~2.5만원', description: '적당한 가격' },
        { value: 'premium', label: '2.5만원 이상', description: '프리미엄 치킨' },
      ],
    },
  ],
};

// 치킨 퀴즈 추천 결과
export const CHICKEN_RECOMMENDATIONS = {
  // 후라이드 + 혼닭 + 맥주
  'original_alone_beer': [
    { slug: 'bbq-golden-olive', name: '황금올리브치킨', brand: 'BBQ', match: 95, reason: '혼자 즐기기 좋은 바삭한 프리미엄 후라이드' },
    { slug: 'kyochon-original', name: '교촌 오리지날', brand: '교촌', match: 90, reason: '담백한 간장 풍미의 클래식' },
    { slug: 'hosigi-fried', name: '호식이 후라이드', brand: '호식이', match: 85, reason: '가성비 좋은 든든한 선택' },
  ],
  // 양념 + 파티 + 맥주
  'sweet_party_beer': [
    { slug: 'bhc-puringkle', name: '뿌링클', brand: 'BHC', match: 96, reason: '모임에서 인기 폭발, 치즈 시즈닝의 매력' },
    { slug: 'kyochon-red', name: '교촌 레드', brand: '교촌', match: 88, reason: '달콤매콤, 누구나 좋아하는 맛' },
    { slug: 'nene-snowing', name: '네네 스노윙', brand: '네네', match: 85, reason: '눈꽃 치즈로 파티 분위기 UP' },
  ],
  // 매운맛 + 소주
  'spicy_couple_soju': [
    { slug: 'goobne-gochu', name: '굽네 고추바사삭', brand: '굽네', match: 94, reason: '칼칼한 매운맛에 소주가 술술' },
    { slug: 'bhc-matchoking', name: '맛초킹', brand: 'BHC', match: 89, reason: '매콤달콤 중독성 있는 맛' },
    { slug: 'cheogajip-supreme', name: '처갓집 슈프림양념', brand: '처갓집', match: 82, reason: '진한 양념의 매력' },
  ],
  // 마늘/간장 + 식사대용
  'garlic_meal_none': [
    { slug: 'puradak-black-allio', name: '푸라닭 블랙알리오', brand: '푸라닭', match: 97, reason: '마늘 풍미 가득, 든든한 한 끼' },
    { slug: 'kyochon-original', name: '교촌 오리지날', brand: '교촌', match: 91, reason: '간장 베이스의 깊은 맛' },
    { slug: 'bbq-jamaica', name: 'BBQ 자메이카 통다리', brand: 'BBQ', match: 86, reason: '풍부한 향신료의 이국적 맛' },
  ],
  // 기본 추천 (fallback)
  'default': [
    { slug: 'bbq-golden-olive', name: '황금올리브치킨', brand: 'BBQ', match: 92, reason: '대한민국 대표 치킨, 모두가 인정하는 맛' },
    { slug: 'bhc-puringkle', name: '뿌링클', brand: 'BHC', match: 88, reason: 'MZ세대 인기 1위, 중독성 있는 치즈맛' },
    { slug: 'kyochon-original', name: '교촌 오리지날', brand: '교촌', match: 85, reason: '간장치킨의 원조, 변함없는 클래식' },
  ],
};

// Mock 데이터 함수
export function getMockBrands(category: string): Brand[] | null {
  if (category === 'chicken') {
    return CHICKEN_MENUS;
  }
  if (category === 'running-shoes') {
    return RUNNING_SHOES_BRANDS;
  }
  return null;
}

export function getMockCategory(slug: string): Category | null {
  if (slug === 'chicken') {
    return CHICKEN_CATEGORY;
  }
  if (slug === 'running-shoes') {
    return RUNNING_SHOES_CATEGORY;
  }
  return null;
}
