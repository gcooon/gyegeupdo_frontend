'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useProductComparison } from '@/hooks/useModels';
import { TierBadge } from '@/components/tier/TierBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  X,
  ArrowRight,
  Users,
  ThumbsUp,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import { getMockProductsByCategory } from '@/lib/mockProducts';
import { ProductDetail } from '@/types/model';
import { TierLevel } from '@/lib/tier';

interface CompareContentProps {
  category: string;
  slugs: string[];
}

// 카테고리별 아이콘 및 라벨
const CATEGORY_INFO: Record<string, { icon: string; name: string }> = {
  'running-shoes': { icon: '👟', name: '러닝화' },
  'chicken': { icon: '🍗', name: '치킨' },
};

export function CompareContent({ category, slugs }: CompareContentProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(slugs.slice(0, 2));
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingSlot, setSelectingSlot] = useState<0 | 1>(0);
  const [tierFilter, setTierFilter] = useState<TierLevel | 'all'>('all');

  // Mock 데이터에서 모든 제품 가져오기
  const allProducts = useMemo(() => {
    return getMockProductsByCategory(category);
  }, [category]);

  const categoryInfo = CATEGORY_INFO[category] || { icon: '📦', name: '제품' };

  const {
    data: comparison,
    isLoading,
    error,
  } = useProductComparison(selectedSlugs[0] || '', selectedSlugs[1] || '');

  // 필터링된 제품 목록
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.name.toLowerCase().includes(query)
      );
    }

    // 티어 필터
    if (tierFilter !== 'all') {
      filtered = filtered.filter((p) => p.tier === tierFilter);
    }

    return filtered;
  }, [allProducts, searchQuery, tierFilter]);

  // 티어별 제품 그룹
  const productsByTier = useMemo(() => {
    const grouped: Record<TierLevel, ProductDetail[]> = {
      S: [],
      A: [],
      B: [],
      C: [],
    };
    filteredProducts.forEach((p) => {
      if (grouped[p.tier]) {
        grouped[p.tier].push(p);
      }
    });
    return grouped;
  }, [filteredProducts]);

  const openProductSelector = (slot: 0 | 1) => {
    setSelectingSlot(slot);
    setSearchQuery('');
    setTierFilter('all');
    setIsModalOpen(true);
  };

  const handleSelectProduct = (slug: string) => {
    const newSlugs = [...selectedSlugs];
    newSlugs[selectingSlot] = slug;
    setSelectedSlugs(newSlugs);
    setIsModalOpen(false);
    setSearchQuery('');
  };

  const getSelectedProduct = (slot: number) => {
    const slug = selectedSlugs[slot];
    return allProducts.find((p) => p.slug === slug);
  };

  // Product Selector Modal
  const ProductSelectorModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {categoryInfo.icon} {selectingSlot === 0 ? '첫 번째' : '두 번째'} 제품 선택
          </DialogTitle>
        </DialogHeader>

        {/* Search & Filter */}
        <div className="space-y-3 flex-shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`${categoryInfo.name} 이름 또는 브랜드 검색...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Tier Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button
              variant={tierFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTierFilter('all')}
              className={tierFilter === 'all' ? 'bg-accent hover:bg-accent/90' : ''}
            >
              전체 ({allProducts.length})
            </Button>
            {(['S', 'A', 'B', 'C'] as TierLevel[]).map((tier) => {
              const count = allProducts.filter((p) => p.tier === tier).length;
              if (count === 0) return null;
              return (
                <Button
                  key={tier}
                  variant={tierFilter === tier ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTierFilter(tier)}
                  className={tierFilter === tier ? 'bg-accent hover:bg-accent/90' : ''}
                >
                  <TierBadge tier={tier} size="sm" showLabel={false} />
                  <span className="ml-1">({count})</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-1">다른 검색어를 입력해보세요.</p>
            </div>
          ) : searchQuery ? (
            // 검색 결과 (플랫 리스트)
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const isSelected = selectedSlugs.includes(product.slug);
                const isOtherSlot = selectedSlugs[selectingSlot === 0 ? 1 : 0] === product.slug;

                return (
                  <button
                    key={product.id}
                    disabled={isOtherSlot}
                    onClick={() => handleSelectProduct(product.slug)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isOtherSlot
                        ? 'opacity-40 cursor-not-allowed border-border'
                        : isSelected
                          ? 'ring-2 ring-accent border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center relative">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl">{categoryInfo.icon}</span>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Check className="h-6 w-6 text-accent" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{product.brand.name}</p>
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <TierBadge tier={product.tier} size="sm" showLabel={false} />
                      <span className="text-xs text-muted-foreground">{product.tier_score.toFixed(1)}점</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            // 티어별 그룹화
            <div className="space-y-6">
              {(['S', 'A', 'B', 'C'] as TierLevel[]).map((tier) => {
                const products = productsByTier[tier];
                if (products.length === 0) return null;

                return (
                  <div key={tier}>
                    <div className="flex items-center gap-2 mb-3 sticky top-0 bg-background py-2">
                      <TierBadge tier={tier} size="md" />
                      <span className="text-sm text-muted-foreground">({products.length}개)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {products.map((product) => {
                        const isSelected = selectedSlugs.includes(product.slug);
                        const isOtherSlot = selectedSlugs[selectingSlot === 0 ? 1 : 0] === product.slug;

                        return (
                          <button
                            key={product.id}
                            disabled={isOtherSlot}
                            onClick={() => handleSelectProduct(product.slug)}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              isOtherSlot
                                ? 'opacity-40 cursor-not-allowed border-border'
                                : isSelected
                                  ? 'ring-2 ring-accent border-accent bg-accent/5'
                                  : 'border-border hover:border-accent/50 hover:shadow-md'
                            }`}
                          >
                            <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center relative">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-2xl">{categoryInfo.icon}</span>
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 bg-accent/20 rounded-lg flex items-center justify-center">
                                  <Check className="h-6 w-6 text-accent" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{product.brand.name}</p>
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-medium">{product.tier_score.toFixed(1)}점</span>
                              <span className="text-xs text-muted-foreground">
                                {(product.price_min / 1000).toFixed(0)}k~
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // 두 제품 모두 선택되지 않은 초기 상태
  if (selectedSlugs.length < 2 || !selectedSlugs[0] || !selectedSlugs[1]) {
    const productA = getSelectedProduct(0);
    const productB = getSelectedProduct(1);

    return (
      <div className="space-y-8">
        <ProductSelectorModal />

        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">{categoryInfo.icon} VS 비교</h1>
          <p className="text-muted-foreground">
            두 제품을 선택하여 상세 비교해보세요
          </p>
        </div>

        {/* Product Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[0, 1].map((slot) => {
            const product = slot === 0 ? productA : productB;

            return (
              <Card
                key={slot}
                className={`card-base overflow-hidden ${!product ? 'border-dashed' : ''}`}
              >
                <CardContent className="p-6">
                  {product ? (
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-muted rounded-xl flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="text-5xl">{categoryInfo.icon}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.brand.name}</p>
                      <p className="font-bold text-lg">{product.name}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <TierBadge tier={product.tier} size="md" />
                        <span className="font-medium">{product.tier_score.toFixed(1)}점</span>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => openProductSelector(slot as 0 | 1)}
                      >
                        다른 제품 선택
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openProductSelector(slot as 0 | 1)}
                      className="w-full py-12 text-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-current rounded-xl flex items-center justify-center">
                        <Plus className="h-8 w-8" />
                      </div>
                      <p className="font-medium">
                        {slot === 0 ? '첫 번째' : '두 번째'} 제품 선택
                      </p>
                      <p className="text-sm mt-1">클릭하여 제품을 선택하세요</p>
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* VS Indicator */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-accent">VS</span>
          </div>
        </div>

        {/* Compare Button */}
        {productA && productB && (
          <div className="text-center">
            <Button className="bg-accent hover:bg-accent/90 px-8 py-6 text-lg">
              비교 결과 보기
            </Button>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>총 {allProducts.length}개의 {categoryInfo.name} 제품 비교 가능</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">비교 분석 중...</p>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">비교 데이터를 불러오는데 실패했습니다.</p>
        <Button onClick={() => setSelectedSlugs([])}>다시 선택하기</Button>
      </div>
    );
  }

  const { model_a, model_b, vote_a, vote_b } = comparison;
  const totalVotes = Math.floor(Math.random() * 200) + 150;

  // Calculate winner for each score
  const getScoreComparison = () => {
    if (!model_a.scores || !model_b.scores) return { aWins: 0, bWins: 0, ties: 0 };

    let aWins = 0, bWins = 0, ties = 0;
    model_a.scores.forEach((scoreA) => {
      const scoreB = model_b.scores?.find((s) => s.key === scoreA.key);
      if (scoreB) {
        if (scoreA.value > scoreB.value) aWins++;
        else if (scoreB.value > scoreA.value) bWins++;
        else ties++;
      }
    });
    return { aWins, bWins, ties };
  };

  const scoreComparison = getScoreComparison();

  return (
    <div className="space-y-8">
      <ProductSelectorModal />

      {/* Header with Change Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{categoryInfo.icon} VS 비교</h1>
        <Button variant="outline" onClick={() => setSelectedSlugs([])}>
          다른 제품 비교
        </Button>
      </div>

      {/* Product Cards Side by Side */}
      <div className="grid md:grid-cols-2 gap-6">
        {[model_a, model_b].map((product, index) => {
          const isWinner =
            (index === 0 && scoreComparison.aWins > scoreComparison.bWins) ||
            (index === 1 && scoreComparison.bWins > scoreComparison.aWins);

          return (
            <Card
              key={product.id}
              className={`card-base overflow-hidden ${isWinner ? 'ring-2 ring-accent' : ''}`}
            >
              {isWinner && (
                <div className="bg-accent text-accent-foreground text-center py-1 text-sm font-medium">
                  🏆 추천
                </div>
              )}
              <CardContent className="p-6">
                <div className="aspect-[4/3] bg-muted rounded-xl mb-4 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-6xl">{categoryInfo.icon}</span>
                  )}
                </div>

                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">{product.brand.name}</p>
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <TierBadge tier={product.tier} size="lg" />
                    <span className="font-semibold">{product.tier_score.toFixed(1)}점</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">가격대</span>
                    <span className="font-medium">
                      {product.price_min?.toLocaleString() || '-'}원 ~
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" variant="outline" asChild>
                    <Link href={`/${category}/model/${product.slug}`}>
                      자세히 보기
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openProductSelector(index as 0 | 1)}
                    title="제품 변경"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Score Comparison Table */}
      <Card className="card-base">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>성능 비교</span>
            <div className="flex items-center gap-4 text-sm font-normal">
              <span className="text-accent">{model_a.name}: {scoreComparison.aWins}승</span>
              <span className="text-muted-foreground">{scoreComparison.ties}무</span>
              <span className="text-primary">{model_b.name}: {scoreComparison.bWins}승</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {model_a.scores?.map((scoreA) => {
              const scoreB = model_b.scores?.find((s) => s.key === scoreA.key);
              if (!scoreB) return null;

              const aWins = scoreA.value > scoreB.value;
              const bWins = scoreB.value > scoreA.value;
              const diff = Math.abs(scoreA.value - scoreB.value);

              return (
                <div
                  key={scoreA.key}
                  className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center p-3 rounded-xl bg-muted/30"
                >
                  {/* Left Score */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${aWins ? 'text-accent' : 'text-muted-foreground'}`}
                    >
                      {scoreA.value.toFixed(0)}
                    </span>
                    {aWins && diff >= 5 && (
                      <Badge className="bg-accent/20 text-accent text-xs">+{diff.toFixed(0)}</Badge>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <span className="text-sm font-medium">{scoreA.label}</span>
                    {!aWins && !bWins && (
                      <Minus className="h-3 w-3 mx-auto text-muted-foreground mt-1" />
                    )}
                  </div>

                  {/* Right Score */}
                  <div className="flex items-center justify-end gap-2">
                    {bWins && diff >= 5 && (
                      <Badge className="bg-primary/20 text-primary text-xs">+{diff.toFixed(0)}</Badge>
                    )}
                    <span
                      className={`text-lg font-bold ${bWins ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {scoreB.value.toFixed(0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Community Vote */}
      <Card className="card-base">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            커뮤니티 투표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            {totalVotes}명이 투표에 참여했습니다
          </p>

          <div className="space-y-4">
            {/* Vote Progress */}
            <div className="flex h-12 rounded-xl overflow-hidden">
              <div
                className="bg-accent flex items-center justify-center text-accent-foreground font-bold transition-all"
                style={{ width: `${vote_a}%` }}
              >
                {vote_a}%
              </div>
              <div
                className="bg-primary flex items-center justify-center text-primary-foreground font-bold transition-all"
                style={{ width: `${vote_b}%` }}
              >
                {vote_b}%
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-sm">
              <span className="font-medium">{model_a.name}</span>
              <span className="font-medium">{model_b.name}</span>
            </div>

            {/* Vote Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" className="h-12">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {model_a.name} 선택
              </Button>
              <Button variant="outline" className="h-12">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {model_b.name} 선택
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="card-base bg-muted/30">
        <CardContent className="py-8 text-center">
          <h3 className="text-lg font-semibold mb-2">어떤 제품이 나에게 맞을까요?</h3>
          <p className="text-muted-foreground mb-4">
            3분 테스트로 나에게 맞는 {categoryInfo.name}를 찾아보세요
          </p>
          <Button className="bg-accent hover:bg-accent/90" asChild>
            <Link href={`/${category}/quiz`}>무료 테스트 시작하기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
