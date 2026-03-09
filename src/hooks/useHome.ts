'use client';

import { useQuery } from '@tanstack/react-query';
import api, { ApiResponse } from '@/lib/api';
import type { TierLevel } from '@/lib/tier';

// 홈 요약 데이터 타입
export interface HomeTopItem {
  name: string;
  slug: string;
  tier: TierLevel;
  score: number;
  brand_name: string;
  brand_slug: string;
  image_url: string;
  usage: string;
}

export interface HomeCategory {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  top_items: HomeTopItem[];
  trending: string;
}

export interface HomeDispute {
  id: number;
  category: string;
  category_name: string;
  category_icon: string;
  product_id: number;
  product_name: string;
  product_slug: string;
  brand_name: string;
  current_tier: TierLevel;
  proposed_tier: TierLevel;
  up_votes: number;
  down_votes: number;
  total_votes: number;
  reason: string;
  days_left: number;
}

export interface HomeReview {
  id: number;
  category: string;
  category_icon: string;
  user: {
    name: string;
    type: string;
  };
  product: {
    name: string;
    brand: string;
    tier: TierLevel;
    slug: string;
  };
  rating: number;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
}

export interface HomeUserChart {
  slug: string;
  title: string;
  author: string;
  likes: number;
  views: number;
  items: number;
}

export interface HomeSummaryData {
  categories: HomeCategory[];
  disputes: HomeDispute[];
  reviews: HomeReview[];
  user_charts: HomeUserChart[];
}

export function useHomeSummary() {
  return useQuery({
    queryKey: ['home', 'summary'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<HomeSummaryData>>('/home/summary/');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  });
}
