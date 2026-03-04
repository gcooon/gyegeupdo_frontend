'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Clock,
  User,
  Share2,
  Flag,
  Star,
  HelpCircle,
  MessageCircle,
  TrendingUp,
  MoreHorizontal,
  Send,
} from 'lucide-react';

interface BoardPostDetailContentProps {
  category: string;
  postId: string;
}

// 게시글 타입
type PostTag = 'review' | 'question' | 'discussion' | 'tip' | 'news';

interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  replies?: Comment[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorLevel: string;
  tag: PostTag;
  productName?: string;
  productSlug?: string;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  comments: Comment[];
}

const TAG_CONFIG: Record<PostTag, { label: string; color: string; icon: React.ElementType }> = {
  review: { label: '리뷰', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Star },
  question: { label: '질문', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: HelpCircle },
  discussion: { label: '토론', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: MessageCircle },
  tip: { label: '팁/노하우', color: 'bg-green-100 text-green-700 border-green-200', icon: TrendingUp },
  news: { label: '소식', color: 'bg-red-100 text-red-700 border-red-200', icon: MessageSquare },
};

// Mock 데이터
const MOCK_POSTS: Record<string, Record<string, Post>> = {
  'running-shoes': {
    '1': {
      id: 1,
      title: '아식스 노바블라스트 5 한달 사용 후기',
      content: `안녕하세요, 러닝매니아입니다.

드디어 노바블라스트 5를 한달 동안 사용해보고 후기를 남깁니다.

## 첫인상
처음 신었을 때 느낌은 "와, 정말 푹신하다"였습니다. 전작 대비 FF BLAST+ 폼이 더 두꺼워졌고, 착지감이 훨씬 부드러워졌어요.

## 장점
1. **쿠셔닝**: 정말 말이 필요 없습니다. 장거리 뛸 때 발이 편해요.
2. **반발력**: 푹신한데도 반발력이 좋아서 페이스 유지가 수월합니다.
3. **착화감**: 발볼이 적당히 넉넉해서 오래 신어도 불편하지 않아요.
4. **디자인**: 개인적으로 이번 컬러웨이가 정말 마음에 들어요.

## 단점
1. **무게**: 전작보다 살짝 무거워진 느낌이에요. (280g → 295g)
2. **내구성**: 아직 한달이라 판단하기 어렵지만, 아웃솔이 생각보다 빨리 닳는 것 같아요.
3. **통기성**: 여름에는 조금 더울 수 있을 것 같습니다.

## 총평
10km 이하 데일리 러닝용으로는 최고의 선택이라고 생각합니다. 특히 평발이시거나 쿠셔닝을 중요시하시는 분들께 강력 추천드려요!

궁금한 점 있으시면 댓글로 남겨주세요! 성심성의껏 답변 드리겠습니다.`,
      author: '러닝매니아',
      authorLevel: '러닝 마스터',
      tag: 'review',
      productName: '노바블라스트 5',
      productSlug: 'novablast-5',
      views: 1234,
      likes: 56,
      dislikes: 3,
      createdAt: '2시간 전',
      comments: [
        {
          id: 1,
          author: '초보러너',
          content: '좋은 후기 감사합니다! 저도 구매 고민 중인데 많은 도움이 됐어요. 혹시 발볼이 넓은 편인데 사이즈 어떻게 추천하시나요?',
          likes: 12,
          dislikes: 0,
          createdAt: '1시간 전',
          replies: [
            {
              id: 2,
              author: '러닝매니아',
              content: '저도 발볼이 넓은 편인데 정사이즈로 딱 맞았어요! 다만 두꺼운 양말 신으시면 반치수 업 추천드립니다.',
              likes: 8,
              dislikes: 0,
              createdAt: '45분 전',
            },
          ],
        },
        {
          id: 3,
          author: '마라토너K',
          content: '노바블라스트 4도 좋았는데 5는 더 좋군요. 저도 갈아탈까 고민됩니다 ㅎㅎ',
          likes: 5,
          dislikes: 0,
          createdAt: '30분 전',
        },
        {
          id: 4,
          author: '런린이',
          content: '이거 가격이 얼마인가요? 할인하는 곳 있을까요?',
          likes: 2,
          dislikes: 0,
          createdAt: '15분 전',
        },
      ],
    },
    '2': {
      id: 2,
      title: '발볼 넓은 분들 추천 러닝화 있을까요?',
      content: `발볼이 넓은 편인데 요즘 나온 러닝화 중에 추천할만한 게 있을까요?

지금까지 신어본 것들:
- 나이키 페가수스: 발볼이 좁아서 포기
- 아식스 젤카야노: 괜찮았는데 조금 무거움
- 뉴발란스 1080: 발볼은 좋은데 쿠션이 너무 물렁물렁

10km 정도 러닝하는데 적당한 쿠션감 있고, 발볼 넓은 러닝화 추천 부탁드립니다!

예산은 15만원 정도 생각하고 있어요.`,
      author: '초보러너',
      authorLevel: '러닝 입문자',
      tag: 'question',
      views: 456,
      likes: 12,
      dislikes: 0,
      createdAt: '5시간 전',
      comments: [
        {
          id: 5,
          author: '러닝고수',
          content: '아식스 노바블라스트 추천드려요! 발볼 넓고 쿠션감 좋습니다. 15만원 내로 살 수 있어요.',
          likes: 15,
          dislikes: 0,
          createdAt: '4시간 전',
        },
        {
          id: 6,
          author: '마라톤준비',
          content: '브룩스 글리세린도 좋아요. 발볼 여유롭고 쿠션 밸런스 좋습니다.',
          likes: 8,
          dislikes: 0,
          createdAt: '3시간 전',
        },
      ],
    },
    '3': {
      id: 3,
      title: '페가수스 41 vs 클리프톤 10 고민중',
      content: `두 제품 중 하나 구매하려는데 실제로 신어보신 분들 의견 부탁드립니다.

## 현재 상황
- 주 3-4회 러닝 (5-10km)
- 현재 신발: 아디다스 울트라부스트 22 (약 800km 사용)
- 중립화 선호
- 예산: 15-18만원

## 나이키 페가수스 41
- 가격: 약 159,000원
- 리액트X 폼 적용
- 에어줌 유닛
- 무게: 약 265g

## 호카 클리프톤 10
- 가격: 약 179,000원
- 경량 EVA 폼
- 메타로커 기술
- 무게: 약 225g

## 고민 포인트
1. 쿠셔닝: 어떤 게 더 편한가요?
2. 내구성: 어떤 게 더 오래가나요?
3. 반응성: 페이스 유지가 더 쉬운 건 어떤 건가요?
4. 사이즈: 두 제품 다 정사이즈로 가면 될까요?

실제 사용해보신 분들 비교 의견 부탁드립니다!`,
      author: '마라톤준비',
      authorLevel: '러닝 중급자',
      tag: 'discussion',
      views: 789,
      likes: 28,
      dislikes: 1,
      createdAt: '1일 전',
      comments: [
        {
          id: 27,
          author: '런코치',
          content: '둘 다 신어봤는데, 편안함은 클리프톤이 한 수 위입니다. 다만 반응성은 페가수스가 더 좋아요. 데일리 러닝 위주면 클리프톤, 가끔 스피드 훈련도 하시면 페가수스 추천합니다.',
          likes: 20,
          dislikes: 1,
          createdAt: '22시간 전',
          replies: [
            {
              id: 28,
              author: '마라톤준비',
              content: '상세한 비교 감사합니다! 저는 스피드 훈련은 별로 안 해서 클리프톤 쪽으로 마음이 기우네요.',
              likes: 4,
              dislikes: 0,
              createdAt: '20시간 전',
            },
          ],
        },
        {
          id: 29,
          author: '러닝매니아',
          content: '내구성은 페가수스가 더 좋은 것 같아요. 클리프톤은 500km 정도에서 쿠션감이 빠지는 느낌이 있었습니다.',
          likes: 15,
          dislikes: 2,
          createdAt: '18시간 전',
        },
        {
          id: 30,
          author: '달리기좋아',
          content: '사이즈는 클리프톤이 살짝 크게 나와요. 반치수 다운 추천합니다. 페가수스는 정사이즈 OK!',
          likes: 12,
          dislikes: 0,
          createdAt: '15시간 전',
        },
      ],
    },
    '4': {
      id: 4,
      title: '러닝화 오래 신는 관리 팁 공유',
      content: `러닝화를 오래 신기 위한 관리 방법을 공유합니다.

## 1. 번갈아 신기
러닝화를 2켤레 이상 번갈아 신으면 수명이 크게 늘어납니다.
- 미드솔 폼이 회복할 시간을 줄 수 있음
- 습기가 완전히 마를 수 있음
- 각 신발의 수명이 약 30-40% 연장

## 2. 올바른 세척법
- **절대 세탁기에 넣지 마세요!** 미드솔 폼이 손상됩니다
- 미온수 + 중성세제로 부드러운 솔로 문질러 세척
- 인솔은 빼서 따로 세척
- 직사광선에 말리지 말고 그늘에서 자연 건조
- 신문지를 안에 넣으면 습기 흡수에 도움

## 3. 보관 방법
- 신발장에 넣을 때 통풍이 되게 해주세요
- 실리카겔 패킷을 넣어두면 습기 방지에 좋습니다
- 신발 트리를 사용하면 형태 유지에 도움

## 4. 교체 시기 판단
- 일반적으로 500-800km 정도에서 교체 추천
- 아웃솔 패턴이 많이 닳았을 때
- 쿠셔닝이 현저히 줄어든 느낌이 들 때
- 무릎이나 발목에 통증이 생기기 시작할 때

## 5. 용도에 맞게 신기
- 러닝화는 러닝에만! 일상용으로 신으면 수명이 빨리 줄어요
- 트레일과 로드는 다른 신발을 사용하세요
- 비 오는 날은 가급적 러닝을 피하거나 방수 기능이 있는 모델 사용

이 팁들만 지켜도 러닝화 수명을 2배 가까이 늘릴 수 있어요!`,
      author: '런코치',
      authorLevel: '러닝 마스터',
      tag: 'tip',
      views: 2341,
      likes: 89,
      dislikes: 1,
      createdAt: '2일 전',
      comments: [
        {
          id: 31,
          author: '초보러너',
          content: '세탁기에 넣으면 안 되는 줄 몰랐어요... 지금까지 계속 세탁기에 돌렸는데 ㅠㅠ 이제부터 손세척 해야겠네요.',
          likes: 18,
          dislikes: 0,
          createdAt: '1일 전',
          replies: [
            {
              id: 32,
              author: '런코치',
              content: '많은 분들이 모르시더라고요! 세탁기 사용하면 미드솔 폼 셀이 파괴되어서 쿠셔닝이 급격히 줄어듭니다.',
              likes: 10,
              dislikes: 0,
              createdAt: '1일 전',
            },
          ],
        },
        {
          id: 33,
          author: '마라톤준비',
          content: '번갈아 신기 팁은 정말 공감합니다. 2켤레 돌려 신으니 확실히 오래 가는 느낌이에요.',
          likes: 12,
          dislikes: 0,
          createdAt: '1일 전',
        },
        {
          id: 34,
          author: '건강러닝',
          content: '교체 시기 판단이 항상 어렵더라고요. 앱으로 거리 기록해두면 편해요!',
          likes: 8,
          dislikes: 0,
          createdAt: '23시간 전',
        },
      ],
    },
    '5': {
      id: 5,
      title: '[속보] 아식스 2025 신제품 라인업 공개',
      content: `아식스가 2025년 신제품 라인업을 공개했습니다. 주목할만한 제품들을 살펴보면...

## 주요 신제품

### 1. 젤님버스 27
- FF BLAST+ ECO 미드솔 적용
- 이전 세대 대비 15% 가벼워진 무게
- PureGEL 기술로 착지 충격 흡수 개선
- 예상 출시가: 189,000원

### 2. 노바블라스트 6
- 완전히 새로운 FF BLAST TURBO 폼
- 트램폴린 느낌의 반발력 강화
- 메타로드 가이던스 시스템 도입
- 예상 출시가: 169,000원

### 3. 매직스피드 5
- 카본 플레이트 탑재
- 레이싱화급 무게 (200g 이하 목표)
- 서브3 러너를 위한 최적화
- 예상 출시가: 249,000원

## 출시 일정
- 젤님버스 27: 3월 출시 예정
- 노바블라스트 6: 5월 출시 예정
- 매직스피드 5: 7월 출시 예정

## 총평
이번 라인업은 아식스가 기술력에 상당히 투자한 느낌입니다. 특히 노바블라스트 6의 새로운 폼이 기대됩니다.

추가 정보가 나오면 업데이트하겠습니다!`,
      author: '러닝뉴스',
      authorLevel: '러닝 리포터',
      tag: 'news',
      views: 3456,
      likes: 67,
      dislikes: 2,
      createdAt: '3일 전',
      comments: [
        {
          id: 35,
          author: '러닝매니아',
          content: '노바블라스트 6 대박 기대됩니다! 5도 좋았는데 새로운 폼이라니 꼭 사야겠어요.',
          likes: 22,
          dislikes: 0,
          createdAt: '2일 전',
        },
        {
          id: 36,
          author: '마라톤준비',
          content: '매직스피드 5 카본 플레이트에 200g 이하면 대회용으로 좋겠네요. 가격이 좀 부담이긴 하지만...',
          likes: 15,
          dislikes: 0,
          createdAt: '2일 전',
          replies: [
            {
              id: 37,
              author: '러닝뉴스',
              content: '맞아요, 가격이 좀 있지만 바포넥스트 대비 10만원 이상 싸니까 가성비는 좋을 것 같아요.',
              likes: 8,
              dislikes: 0,
              createdAt: '2일 전',
            },
          ],
        },
        {
          id: 38,
          author: '건강러닝',
          content: '젤님버스 27 PureGEL 기술이 궁금하네요. 젤카야노에도 적용되면 좋겠어요.',
          likes: 10,
          dislikes: 0,
          createdAt: '1일 전',
        },
      ],
    },
    '6': {
      id: 6,
      title: '젤카야노 31 안정화 진짜 좋나요?',
      content: `오버프로네이션이 있어서 안정화를 찾고 있는데 젤카야노 추천이 많더라고요.

## 저의 상황
- 오버프로네이션 진단 받음 (정형외과)
- 주 2-3회 러닝, 보통 5-7km
- 현재 신발: 일반 운동화 (러닝화 X)
- 달리고 나면 발목 안쪽이 아픔

## 고민
1. 젤카야노 31이 오버프로네이션에 진짜 도움이 되나요?
2. 아식스 GT-2000도 안정화인데 차이가 뭔가요?
3. 가격 차이만큼 젤카야노가 가치가 있나요?
4. 다른 브랜드 안정화도 추천해주세요

## 예산
- 20만원 이하로 생각하고 있어요
- 카야노가 좀 비싸서 GT-2000도 고려중입니다

경험자분들 조언 부탁드립니다!`,
      author: '건강러닝',
      authorLevel: '러닝 입문자',
      tag: 'question',
      views: 234,
      likes: 8,
      dislikes: 0,
      createdAt: '4일 전',
      comments: [
        {
          id: 39,
          author: '런코치',
          content: '오버프로네이션이면 젤카야노 강력 추천합니다! 4D 가이던스 시스템이 내측 지지를 정말 잘 해줘요. GT-2000도 좋지만 지지력은 카야노가 확실히 위입니다.',
          likes: 16,
          dislikes: 0,
          createdAt: '3일 전',
          replies: [
            {
              id: 40,
              author: '건강러닝',
              content: '감사합니다! 매장 가서 둘 다 신어보고 결정할게요.',
              likes: 3,
              dislikes: 0,
              createdAt: '3일 전',
            },
          ],
        },
        {
          id: 41,
          author: '러닝매니아',
          content: '브룩스 어드레날린 GTS도 안정화로 좋아요. 카야노보다 가볍고 가격도 좀 더 합리적입니다.',
          likes: 10,
          dislikes: 0,
          createdAt: '3일 전',
        },
        {
          id: 42,
          author: '달리기좋아',
          content: '저도 오버프로네이션인데 카야노 30 사용 중이에요. 발목 통증이 확실히 줄었습니다. 31은 더 가볍다고 하니 기대되네요!',
          likes: 8,
          dislikes: 0,
          createdAt: '2일 전',
        },
      ],
    },
    '7': {
      id: 7,
      title: '뉴발란스 1080v14 솔직 후기',
      content: `기대하고 구매했는데... 솔직히 말씀드리면 기대 이상이었습니다.

## 구매 동기
- 전작 1080v13이 좋았어서 업그레이드
- 프레시폼X 쿠셔닝이 궁금했음
- 장거리 러닝용 데일리 슈즈 필요

## 착화감 (5/5)
처음 신었을 때 발을 감싸는 니트 어퍼의 느낌이 정말 좋습니다. 발볼도 여유롭고, 뒤꿈치 잡아주는 것도 탄탄해요.

## 쿠셔닝 (5/5)
프레시폼X가 전작 대비 훨씬 좋아졌어요. 푹신하면서도 에너지 리턴이 확실히 느껴집니다. 15km 이상 뛰어도 발이 편해요.

## 반응성 (4/5)
쿠션화라서 레이싱만큼의 반응성은 아니지만, 데일리 러닝에서는 충분합니다. km당 5분 페이스까지는 무리 없이 소화해요.

## 내구성 (4/5)
약 300km 사용한 시점인데, 아웃솔 마모는 크지 않습니다. 다만 어퍼 니트 부분이 살짝 늘어난 느낌이 있어요.

## 무게 (4/5)
285g으로 쿠션화치고는 적당한 무게입니다. 다만 가벼운 신발에서 갈아타면 처음엔 무겁게 느껴질 수 있어요.

## 총점: 4.5/5
장거리 데일리 러닝화로 최고의 선택 중 하나입니다. 특히 쿠셔닝을 중시하는 러너에게 강력 추천합니다.

궁금한 점 있으시면 편하게 질문해주세요!`,
      author: '달리기좋아',
      authorLevel: '러닝 중급자',
      tag: 'review',
      productName: '1080v14',
      productSlug: '1080v14',
      views: 567,
      likes: 34,
      dislikes: 2,
      createdAt: '5일 전',
      comments: [
        {
          id: 43,
          author: '초보러너',
          content: '1080v13이랑 비교하면 어떤 점이 가장 크게 달라졌나요?',
          likes: 8,
          dislikes: 0,
          createdAt: '4일 전',
          replies: [
            {
              id: 44,
              author: '달리기좋아',
              content: '가장 큰 차이는 미드솔 폼이에요. v14의 프레시폼X가 확실히 더 부드럽고 반발력도 좋아졌어요. 어퍼도 더 통기성이 좋아진 느낌입니다.',
              likes: 5,
              dislikes: 0,
              createdAt: '4일 전',
            },
          ],
        },
        {
          id: 45,
          author: '러닝매니아',
          content: '뉴발란스가 최근에 쿠셔닝 기술 많이 좋아졌죠. 1080 시리즈는 항상 안정적인 선택이에요.',
          likes: 12,
          dislikes: 0,
          createdAt: '3일 전',
        },
        {
          id: 46,
          author: '마라톤준비',
          content: '발볼 여유로운 건 좋네요. 사이즈는 정사이즈로 가셨나요?',
          likes: 5,
          dislikes: 0,
          createdAt: '3일 전',
          replies: [
            {
              id: 47,
              author: '달리기좋아',
              content: '네, 정사이즈로 딱 맞았어요! 뉴발란스가 발볼이 넉넉한 편이라 정사이즈 추천드립니다.',
              likes: 3,
              dislikes: 0,
              createdAt: '2일 전',
            },
          ],
        },
      ],
    },
  },
  'chicken': {
    '101': {
      id: 101,
      title: 'BHC 뿌링클 vs BBQ 황올 최종 비교',
      content: `둘 다 먹어본 입장에서 상세 비교해봅니다.

## 뿌링클 (BHC)
- 치즈 시즈닝이 중독성 있음
- 바삭함이 오래 유지됨
- 양이 적당함
- 가격: 약 19,000원

## 황금올리브치킨 (BBQ)
- 올리브유로 튀겨서 담백함
- 기름기가 적어서 덜 느끼함
- 치킨 본연의 맛을 즐기기 좋음
- 가격: 약 20,000원

## 결론
매콤하고 중독성 있는 맛을 원하면 뿌링클, 담백하고 건강한 맛을 원하면 황올 추천드립니다!

개인적으로는 맥주 안주로는 뿌링클, 혼자 먹을 때는 황올이 더 좋았어요.`,
      author: '치킨마스터',
      authorLevel: '치킨 전문가',
      tag: 'review',
      views: 2345,
      likes: 89,
      dislikes: 5,
      createdAt: '1시간 전',
      comments: [
        {
          id: 7,
          author: '야식킹',
          content: '둘 다 맛있죠 ㅎㅎ 저는 뿌링클파입니다!',
          likes: 12,
          dislikes: 2,
          createdAt: '30분 전',
        },
        {
          id: 8,
          author: '혼닭러버',
          content: '황올이 더 낫다고 봅니다. 뿌링클은 너무 자극적이에요.',
          likes: 8,
          dislikes: 5,
          createdAt: '20분 전',
        },
      ],
    },
    '102': {
      id: 102,
      title: '혼자 먹기 좋은 치킨 메뉴 추천해주세요',
      content: `혼자서 먹기에 양 적당하고 맛있는 메뉴 추천 부탁드립니다.

요즘 자취하면서 혼자 치킨 시켜먹을 일이 많은데, 한 마리가 너무 많더라고요.

## 고민하는 점
- 한 마리는 너무 많고, 반마리 메뉴가 있으면 좋겠어요
- 남은 치킨을 다음날 먹어도 맛있는 메뉴면 좋겠습니다
- 예산은 15,000원 이하로 생각하고 있어요

## 지금까지 먹어본 것
- 교촌 반마리: 양은 적당한데 가격이 좀 아쉬움
- 호식이 반마리: 가성비는 좋은데 맛이 평범
- BBQ 황올 반마리: 맛은 좋은데 근처에 매장이 없음

혼닭 고수분들의 추천 부탁드립니다!`,
      author: '혼닭러버',
      authorLevel: '치킨 입문자',
      tag: 'question',
      views: 678,
      likes: 23,
      dislikes: 1,
      createdAt: '3시간 전',
      comments: [
        {
          id: 9,
          author: '자취의달인',
          content: '굽네치킨 반마리 추천드려요! 오븐구이라 다음날 에어프라이어에 돌려도 바삭해요.',
          likes: 18,
          dislikes: 0,
          createdAt: '2시간 전',
          replies: [
            {
              id: 10,
              author: '혼닭러버',
              content: '오 굽네는 생각 못했네요! 오븐구이라 기름기도 적겠네요. 감사합니다!',
              likes: 3,
              dislikes: 0,
              createdAt: '1시간 전',
            },
          ],
        },
        {
          id: 11,
          author: '치킨마스터',
          content: 'BHC 뿌링클 반마리도 괜찮아요. 시즈닝이라 다음날 먹어도 맛 변화가 적어요.',
          likes: 10,
          dislikes: 1,
          createdAt: '1시간 전',
        },
        {
          id: 12,
          author: '배달왕',
          content: '배민에서 1인 전용 메뉴 검색해보세요. 요즘 1인 세트 파는 데 많아요!',
          likes: 7,
          dislikes: 0,
          createdAt: '30분 전',
        },
      ],
    },
    '103': {
      id: 103,
      title: '굽네 vs 후라이드 치킨 뭐가 더 맛있나요?',
      content: `오븐구이 치킨이랑 일반 후라이드 중에 고민되네요.

다이어트 중이라 오븐구이 치킨을 먹으려고 하는데, 솔직히 후라이드만큼 맛있을지 걱정됩니다.

## 오븐구이 (굽네) 장점
- 칼로리가 낮다 (후라이드 대비 약 30% 적음)
- 기름기가 적어서 덜 느끼함
- 건강한 느낌

## 후라이드 장점
- 바삭한 튀김옷의 식감
- 치킨은 역시 튀겨야 제맛
- 맥주랑 더 잘 어울림

## 궁금한 점
1. 굽네가 실제로 맛있나요? 후라이드랑 비교하면?
2. 다이어트 중에 치킨이 먹고 싶으면 굽네가 답인가요?
3. 굽네 메뉴 중 가장 맛있는 거 추천해주세요!`,
      author: '치킨고민',
      authorLevel: '치킨 러버',
      tag: 'discussion',
      views: 456,
      likes: 15,
      dislikes: 2,
      createdAt: '6시간 전',
      comments: [
        {
          id: 13,
          author: '다이어터',
          content: '다이어트 중이면 굽네 고추바사삭 추천! 매콤해서 맛도 있고 칼로리도 낮아요.',
          likes: 22,
          dislikes: 1,
          createdAt: '5시간 전',
        },
        {
          id: 14,
          author: '치킨마스터',
          content: '솔직히 말하면 후라이드가 맛은 더 있어요. 근데 굽네도 나름 맛있습니다. 다이어트 중이면 굽네가 최선의 선택이에요.',
          likes: 15,
          dislikes: 3,
          createdAt: '4시간 전',
          replies: [
            {
              id: 15,
              author: '치킨고민',
              content: '역시 후라이드가 맛은 더 낫군요 ㅠㅠ 그래도 다이어트를 위해 굽네 도전해볼게요!',
              likes: 5,
              dislikes: 0,
              createdAt: '3시간 전',
            },
          ],
        },
      ],
    },
    '104': {
      id: 104,
      title: '치킨 배달 꿀팁 모음',
      content: `배달 치킨 주문할 때 알아두면 좋은 팁들을 정리해봤습니다.

## 주문 타이밍
- 금요일 저녁 6-8시는 피크타임이라 배달이 1시간 이상 걸릴 수 있어요
- 평일 오후 3-4시에 주문하면 갓 튀긴 치킨을 빨리 받을 수 있어요
- 주말 점심도 의외로 빨라요 (저녁보다 주문량이 적음)

## 배달앱 꿀팁
- 배민 쿠폰은 매월 1일에 새로 풀려요
- 쿠팡이츠는 와우 회원이면 무료배달이 많아요
- 요기요 슈퍼클럽도 배달비 할인 많음
- 카드사 할인이랑 중복 가능한 쿠폰을 찾아보세요

## 치킨 맛있게 먹는 팁
1. **바로 먹기**: 배달 오면 바로 드세요. 10분만 지나도 눅눅해져요
2. **포장 열기**: 뚜껑을 살짝 열어서 습기를 빼주세요
3. **에어프라이어 활용**: 남은 치킨은 에어프라이어 180도 5분이면 부활합니다
4. **소스 따로 받기**: 양념치킨은 소스를 따로 받으면 바삭함을 유지할 수 있어요

## 숨겨진 메뉴
- 교촌: 허니콤보 반반 (오리지널+레드) 주문 가능
- BHC: 뿌링클에 치즈볼 추가하면 최고의 조합
- BBQ: 황올에 양념 소스 따로 요청 가능

도움이 되셨다면 좋아요 눌러주세요!`,
      author: '배달왕',
      authorLevel: '배달 고수',
      tag: 'tip',
      views: 1890,
      likes: 76,
      dislikes: 2,
      createdAt: '1일 전',
      comments: [
        {
          id: 16,
          author: '야식킹',
          content: '에어프라이어 팁 진짜 꿀팁이에요! 남은 치킨 항상 버렸는데 이제 살려먹을 수 있겠네요.',
          likes: 25,
          dislikes: 0,
          createdAt: '20시간 전',
        },
        {
          id: 17,
          author: '혼닭러버',
          content: '쿠팡이츠 와우 회원 팁 감사합니다. 배달비 아끼려고 항상 포장만 했는데 ㅎㅎ',
          likes: 12,
          dislikes: 0,
          createdAt: '18시간 전',
        },
        {
          id: 18,
          author: '치킨고민',
          content: '소스 따로 받기는 처음 알았어요! 다음에 꼭 해봐야겠네요.',
          likes: 8,
          dislikes: 0,
          createdAt: '15시간 전',
          replies: [
            {
              id: 19,
              author: '배달왕',
              content: '양념치킨 소스 따로 받으면 세상이 달라져요! 꼭 해보세요 ㅎㅎ',
              likes: 5,
              dislikes: 0,
              createdAt: '14시간 전',
            },
          ],
        },
      ],
    },
    '105': {
      id: 105,
      title: '[신메뉴] 교촌 신메뉴 출시 소식',
      content: `교촌에서 새로운 메뉴를 출시했습니다!

## 교촌 신메뉴 라인업

### 1. 교촌 크리스피 갈릭
- 마늘 풍미를 살린 크리스피 치킨
- 기존 오리지날보다 더 바삭한 튀김옷
- 가격: 한 마리 20,000원 / 반마리 12,000원

### 2. 교촌 매콤 치즈
- 레드 시리즈의 새로운 버전
- 매콤한 양념에 치즈를 더한 메뉴
- 가격: 한 마리 21,000원 / 반마리 12,500원

## 출시 이벤트
- 출시 기념 2,000원 할인 쿠폰 (앱 전용)
- 세트 메뉴 주문 시 콜라 무료 제공
- 이벤트 기간: 이번 달 말까지

## 개인적인 기대
교촌의 간장 소스 베이스는 항상 맛있었는데, 갈릭 버전이 어떨지 정말 궁금합니다. 출시되면 바로 먹어보고 후기 올릴게요!

기대되는 분들 댓글로 알려주세요!`,
      author: '치킨뉴스',
      authorLevel: '치킨 리포터',
      tag: 'news',
      views: 1234,
      likes: 45,
      dislikes: 1,
      createdAt: '2일 전',
      comments: [
        {
          id: 20,
          author: '치킨마스터',
          content: '크리스피 갈릭이 기대됩니다! 교촌 오리지날에 마늘 풍미라니 꼭 먹어봐야겠어요.',
          likes: 15,
          dislikes: 0,
          createdAt: '1일 전',
        },
        {
          id: 21,
          author: '매운맛좋아',
          content: '매콤 치즈도 궁금하네요. 교촌 레드도 맛있었는데 치즈 버전이라니!',
          likes: 9,
          dislikes: 0,
          createdAt: '1일 전',
        },
        {
          id: 22,
          author: '혼닭러버',
          content: '반마리 가격이 12,000원이면 괜찮네요. 혼닭으로 딱이다!',
          likes: 7,
          dislikes: 0,
          createdAt: '20시간 전',
        },
      ],
    },
    '106': {
      id: 106,
      title: '매운 치킨 추천 부탁드립니다',
      content: `정말 매운 치킨 먹고 싶은데 추천 부탁드려요!

평소에 매운 음식을 좋아하는 편이라 웬만한 매운맛은 다 괜찮습니다.

## 먹어본 매운 치킨
- 교촌 레드: 맛있긴 한데 매운맛이 약함 (매운맛 2/5)
- BHC 맛초킹: 달콤매콤 느낌, 매운맛은 보통 (매운맛 2.5/5)
- 굽네 볼케이노: 이것도 생각보다 안 매움 (매운맛 3/5)

## 원하는 수준
- 불닭볶음면 정도의 매운맛
- 매운데 맛도 있어야 함 (그냥 캡사이신만 넣은 건 별로)
- 치킨 본연의 맛도 느낄 수 있으면 좋겠어요

진짜 매운 치킨 아시는 분 추천 부탁드립니다!`,
      author: '매운맛좋아',
      authorLevel: '매운맛 도전자',
      tag: 'question',
      views: 345,
      likes: 11,
      dislikes: 0,
      createdAt: '3일 전',
      comments: [
        {
          id: 23,
          author: '스코빌마스터',
          content: '네네치킨 인피니티 땡초치킨 드셔보세요. 진짜 매워요. 불닭 수준은 되는 것 같습니다.',
          likes: 14,
          dislikes: 1,
          createdAt: '2일 전',
          replies: [
            {
              id: 24,
              author: '매운맛좋아',
              content: '오 네네치킨에 그런 메뉴가 있었군요! 다음에 꼭 시켜봐야겠어요.',
              likes: 3,
              dislikes: 0,
              createdAt: '2일 전',
            },
          ],
        },
        {
          id: 25,
          author: '치킨마스터',
          content: '처갓집 슈프림양념 매운맛 단계 높여서 주문해보세요. 매운맛 조절이 가능한데 최고 단계는 꽤 매워요.',
          likes: 10,
          dislikes: 0,
          createdAt: '2일 전',
        },
        {
          id: 26,
          author: '야식킹',
          content: '동네 로컬 치킨집 중에 매운 치킨 파는 곳이 프랜차이즈보다 매운 경우가 많아요. 배달앱에서 "매운 치킨" 검색해보세요!',
          likes: 6,
          dislikes: 0,
          createdAt: '1일 전',
        },
      ],
    },
  },
};

const CATEGORY_CONFIG: Record<string, { name: string; icon: string }> = {
  'running-shoes': { name: '러닝화', icon: '👟' },
  'chicken': { name: '치킨', icon: '🍗' },
};

export function BoardPostDetailContent({ category, postId }: BoardPostDetailContentProps) {
  const router = useRouter();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['running-shoes'];
  const post = MOCK_POSTS[category]?.[postId];

  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">게시글을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">삭제되었거나 존재하지 않는 게시글입니다.</p>
        <Button onClick={() => router.push(`/${category}/board`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          게시판으로 돌아가기
        </Button>
      </div>
    );
  }

  const tagConfig = TAG_CONFIG[post.tag];
  const TagIcon = tagConfig.icon;

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    // TODO: API 연동
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${category}/board`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {config.icon} {config.name} 게시판
      </Button>

      {/* 게시글 본문 */}
      <Card>
        <CardContent className="p-6">
          {/* 태그 */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className={tagConfig.color}>
              <TagIcon className="h-3 w-3 mr-1" />
              {tagConfig.label}
            </Badge>
            {post.productName && (
              <Link href={`/${category}/model/${post.productSlug}`}>
                <Badge variant="secondary" className="hover:bg-accent/20 cursor-pointer">
                  {post.productName}
                </Badge>
              </Link>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between pb-4 border-b mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {post.authorLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    조회 {post.views}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* 본문 내용 */}
          <div className="prose prose-sm max-w-none dark:prose-invert mb-6">
            {post.content.split('\n').map((line, index) => {
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-lg font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.match(/^\d+\./)) {
                return <li key={index} className="ml-4">{line}</li>;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              // Bold text 처리
              const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
            })}
          </div>

          {/* 좋아요/싫어요 및 액션 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {post.likes + (liked ? 1 : 0)}
              </Button>
              <Button
                variant={disliked ? 'destructive' : 'outline'}
                size="sm"
                onClick={handleDislike}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                {post.dislikes + (disliked ? 1 : 0)}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                공유
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Flag className="h-4 w-4" />
                신고
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 {post.comments.length}개
          </h2>

          {/* 댓글 작성 */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="댓글을 작성해주세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  등록
                </Button>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  return (
    <div className={`${isReply ? 'ml-12 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-xs font-medium">{comment.author[0]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>
          <p className="text-sm mb-2">{comment.content}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 hover:text-accent ${liked ? 'text-accent' : ''}`}
            >
              <ThumbsUp className="h-3 w-3" />
              {comment.likes + (liked ? 1 : 0)}
            </button>
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 hover:text-accent"
              >
                <MessageSquare className="h-3 w-3" />
                답글
              </button>
            )}
          </div>

          {/* 답글 작성 폼 */}
          {showReplyForm && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="답글을 작성해주세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}>
                  등록
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          )}

          {/* 대댓글 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
