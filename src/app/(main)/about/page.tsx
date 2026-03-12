import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Sparkles, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: '서비스 소개 | 계급도',
  description: '계급도는 다양한 분야의 제품과 브랜드를 커뮤니티 기반으로 평가하고 순위를 매기는 큐레이션 플랫폼입니다.',
};

export default function AboutPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">About Us</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">계급도 소개</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          커뮤니티가 만들어가는 신뢰할 수 있는 제품 순위 플랫폼
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              미션
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              광고나 협찬에 좌우되지 않는, 실사용자들의 경험을 바탕으로 한
              객관적인 제품 평가와 순위를 제공합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              커뮤니티
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              전문가와 일반 사용자가 함께 참여하여 제품을 평가하고,
              투표를 통해 계급을 조정합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              특징
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2">
              <li>• 실사용자 리뷰 기반 평가</li>
              <li>• 커뮤니티 투표로 계급 조정</li>
              <li>• 다양한 카테고리 지원</li>
              <li>• 나만의 계급도 만들기</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent" />
              문의
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              서비스 관련 문의사항이 있으시면 아래로 연락해주세요.
            </p>
            <p className="mt-2 font-medium">contact@gyegeupdo.kr</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>© 2024 계급도. All rights reserved.</p>
        <p className="mt-1">운영자: 박경근</p>
      </div>
    </div>
  );
}
