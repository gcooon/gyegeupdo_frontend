import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// 티어별 색상 설정 - 한국 전통 계급 시스템
const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: '#FFD700', text: '#000', label: '황제' },  // Gold
  A: { bg: '#9370DB', text: '#FFF', label: '왕' },    // Purple
  B: { bg: '#4169E1', text: '#FFF', label: '양반' },  // Royal Blue
  C: { bg: '#3CB371', text: '#FFF', label: '중인' },  // Medium Sea Green
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 파라미터 추출
  const type = searchParams.get('type') || 'default';
  const title = searchParams.get('title') || '계급도';
  const subtitle = searchParams.get('subtitle') || '';
  const tier = searchParams.get('tier') || '';
  const category = searchParams.get('category') || '';
  const items = searchParams.get('items') || ''; // JSON 배열 형태

  try {
    // 타입별 OG 이미지 생성
    if (type === 'tier') {
      return generateTierOG({ title, tier, subtitle });
    } else if (type === 'my-tier') {
      return generateMyTierOG({ title, items, category });
    } else if (type === 'quiz-result') {
      return generateQuizResultOG({ title, subtitle, items });
    } else {
      return generateDefaultOG({ title, subtitle, category });
    }
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}

// 기본 OG 이미지
function generateDefaultOG({
  title,
  subtitle,
  category,
}: {
  title: string;
  subtitle: string;
  category: string;
}) {
  const categoryEmoji = category === 'running-shoes' ? '👟' : category === 'chicken' ? '🍗' : '🏆';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #EEF4FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 로고 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '64px' }}>{categoryEmoji}</span>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1E3A5F',
            }}
          >
            계급도
          </span>
        </div>

        {/* 타이틀 */}
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#1E3A5F',
            margin: '0',
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {title}
        </h1>

        {/* 서브타이틀 */}
        {subtitle && (
          <p
            style={{
              fontSize: '28px',
              color: '#64748B',
              marginTop: '16px',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* 하단 URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94A3B8',
            fontSize: '24px',
          }}
        >
          gyegeupdo.kr
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// 티어 상세 OG 이미지
function generateTierOG({
  title,
  tier,
  subtitle,
}: {
  title: string;
  tier: string;
  subtitle: string;
}) {
  const tierColor = TIER_COLORS[tier] || TIER_COLORS.B;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #EEF4FF 0%, #DBEAFE 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 티어 뱃지 */}
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '24px',
            background: tierColor.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '48px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <span
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: tierColor.text,
            }}
          >
            {tierColor.label || tier}
          </span>
        </div>

        {/* 텍스트 영역 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#1E3A5F',
              margin: '0',
              lineHeight: '1.2',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '32px',
                color: '#64748B',
                marginTop: '12px',
              }}
            >
              {subtitle}
            </p>
          )}
          <p
            style={{
              fontSize: '24px',
              color: '#94A3B8',
              marginTop: '24px',
            }}
          >
            gyegeupdo.kr
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// 나의 계급도 OG 이미지
function generateMyTierOG({
  title,
  items,
  category,
}: {
  title: string;
  items: string;
  category: string;
}) {
  let parsedItems: Array<{ name: string; tier: string }> = [];
  try {
    parsedItems = JSON.parse(items);
  } catch {
    parsedItems = [];
  }

  // 티어별로 그룹화
  const tiers = ['S', 'A', 'B', 'C'];
  const categoryEmoji = category === 'running-shoes' ? '👟' : category === 'chicken' ? '🍗' : '🏆';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
          fontFamily: 'sans-serif',
          padding: '32px',
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>{categoryEmoji}</span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFF' }}>
              {title || '나의 계급도'}
            </span>
          </div>
          <span style={{ fontSize: '20px', color: '#94A3B8' }}>gyegeupdo.kr</span>
        </div>

        {/* 티어 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {tiers.slice(0, 3).map((tier) => {
            const tierItems = parsedItems.filter((item) => item.tier === tier);
            const tierColor = TIER_COLORS[tier];

            return (
              <div
                key={tier}
                style={{
                  display: 'flex',
                  height: '140px',
                }}
              >
                {/* 티어 라벨 */}
                <div
                  style={{
                    width: '80px',
                    background: tierColor.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: tier === 'S' ? '12px 0 0 0' : tier === 'B' ? '0 0 0 12px' : '0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: tierColor.text,
                    }}
                  >
                    {tierColor.label || tier}
                  </span>
                </div>

                {/* 아이템 영역 */}
                <div
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    gap: '12px',
                    borderRadius: tier === 'S' ? '0 12px 0 0' : tier === 'B' ? '0 0 12px 0' : '0',
                  }}
                >
                  {tierItems.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '18px',
                        fontWeight: '500',
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                  {tierItems.length === 0 && (
                    <span style={{ color: '#6B7280', fontSize: '16px' }}>-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// 퀴즈 결과 OG 이미지
function generateQuizResultOG({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string;
}) {
  let parsedItems: Array<{ name: string; brand: string; match: number }> = [];
  try {
    parsedItems = JSON.parse(items);
  } catch {
    parsedItems = [];
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 결과 뱃지 */}
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ fontSize: '56px' }}>🎯</span>
        </div>

        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#FFF',
            margin: '0',
            textAlign: 'center',
          }}
        >
          {title || '퀴즈 결과'}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.8)',
              marginTop: '12px',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* TOP 3 결과 */}
        {parsedItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
            }}
          >
            {parsedItems.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFF' }}>
                  {idx + 1}. {item.brand} {item.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '18px',
                    color: '#93C5FD',
                    marginTop: '4px',
                  }}
                >
                  {item.match}% 매칭
                </span>
              </div>
            ))}
          </div>
        )}

        <p
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          gyegeupdo.kr
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
