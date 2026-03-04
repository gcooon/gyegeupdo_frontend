'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Score {
  key: string;
  label: string;
  value: number;
}

interface RadarChartSectionProps {
  scores: Score[];
  expertScores?: Score[];
  showComparison?: boolean;
}

export function RadarChartSection({
  scores,
  expertScores,
  showComparison = true,
}: RadarChartSectionProps) {
  // Transform data for recharts
  const chartData = scores.map((score) => {
    const expertScore = expertScores?.find((e) => e.key === score.key);
    return {
      subject: score.label,
      user: score.value,
      expert: expertScore?.value || score.value,
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickCount={5}
          />

          {showComparison && expertScores && (
            <Radar
              name="비교 데이터"
              dataKey="expert"
              stroke="#1A1A2E"
              fill="#1A1A2E"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          )}

          <Radar
            name="커뮤니티 평가"
            dataKey="user"
            stroke="#E94560"
            fill="#E94560"
            fillOpacity={0.3}
            strokeWidth={2}
          />

          {showComparison && expertScores && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
