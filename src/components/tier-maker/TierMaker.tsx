'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TierLevel, TIER_CONFIG } from '@/lib/tier';
import { Confetti } from '@/components/effects/Confetti';
import { ShareButtons } from '@/components/share/ShareButtons';
import { useGamificationStore } from '@/store/gamificationStore';
import { POINT_ACTIONS } from '@/types/gamification';
import {
  Download,
  RotateCcw,
  Sparkles,
  GripVertical,
  X,
  Check,
  Crown,
  Medal,
  Award,
} from 'lucide-react';

interface TierItem {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  tier: TierLevel | null;
}

interface TierMakerProps {
  category: string;
  categoryName: string;
  initialItems: TierItem[];
  onSave?: (items: TierItem[]) => void;
}

const TIER_ICONS: Record<TierLevel, React.ElementType> = {
  S: Crown,
  A: Medal,
  B: Award,
  C: Sparkles,
  D: Sparkles,
};

export function TierMaker({ category, categoryName, initialItems, onSave }: TierMakerProps) {
  const [items, setItems] = useState<TierItem[]>(initialItems);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const tierListRef = useRef<HTMLDivElement>(null);

  const { addPoints, incrementStat } = useGamificationStore();

  const tiers: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

  // 아이템을 특정 티어로 이동
  const moveToTier = useCallback((itemId: string, newTier: TierLevel | null) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, tier: newTier } : item))
    );
  }, []);

  // 미배치 아이템
  const unassignedItems = items.filter((item) => item.tier === null);

  // 티어별 아이템
  const itemsByTier = tiers.reduce(
    (acc, tier) => {
      acc[tier] = items.filter((item) => item.tier === tier);
      return acc;
    },
    {} as Record<TierLevel, TierItem[]>
  );

  // 완료 처리
  const handleComplete = () => {
    const assignedCount = items.filter((item) => item.tier !== null).length;
    if (assignedCount < 3) {
      alert('최소 3개 이상의 항목을 배치해주세요!');
      return;
    }
    setIsComplete(true);
    setShowConfetti(true);
    onSave?.(items);

    // Gamification: 티어메이커 완료 포인트
    addPoints(POINT_ACTIONS.create_tier);
    incrementStat('tierMakers');
  };

  // 리셋
  const handleReset = () => {
    setItems(initialItems);
    setIsComplete(false);
  };

  // 이미지 다운로드
  const handleDownload = async () => {
    if (!tierListRef.current) {
      alert('캡처할 영역을 찾을 수 없습니다.');
      return;
    }

    setIsDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(tierListRef.current, {
        backgroundColor: '#1F2937',
        pixelRatio: 2,
        skipFonts: true,
      });

      const link = document.createElement('a');
      link.download = `나의_${categoryName}_계급도.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  // OG 이미지 URL 생성
  const getShareImageUrl = () => {
    const assignedItems = items
      .filter((item) => item.tier !== null)
      .map((item) => ({ name: item.name, tier: item.tier }));
    const itemsParam = encodeURIComponent(JSON.stringify(assignedItems.slice(0, 10)));
    return `/api/og?type=my-tier&title=나의 ${categoryName} 계급도&category=${category}&items=${itemsParam}`;
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">나의 {categoryName} 계급도 만들기</h1>
            <p className="text-muted-foreground text-sm mt-1">
              아래 항목들을 드래그하여 원하는 티어에 배치하세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              리셋
            </Button>
            {!isComplete && (
              <Button onClick={handleComplete} className="bg-accent hover:bg-accent/90">
                <Check className="h-4 w-4 mr-1" />
                완료
              </Button>
            )}
          </div>
        </div>

        {/* 티어 리스트 */}
        <div ref={tierListRef} className="rounded-xl overflow-hidden shadow-lg">
          {tiers.map((tier) => {
            const config = TIER_CONFIG[tier];
            const TierIcon = TIER_ICONS[tier];
            const tierItems = itemsByTier[tier];

            return (
              <div key={tier} className="flex min-h-[80px]">
                {/* 티어 라벨 */}
                <div
                  className="w-16 md:w-20 flex flex-col items-center justify-center shrink-0 relative"
                  style={{ background: config.gradient }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <span className="font-black text-white text-2xl md:text-3xl relative z-10 drop-shadow-lg">
                    {tier}
                  </span>
                  <TierIcon className="h-4 w-4 text-white/80 mt-0.5 relative z-10" />
                </div>

                {/* 드롭 영역 */}
                <div
                  className="flex-1 p-2 md:p-3 bg-slate-800/50 min-h-[80px] flex flex-wrap gap-2 items-start content-start"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const itemId = e.dataTransfer.getData('itemId');
                    if (itemId) moveToTier(itemId, tier);
                  }}
                >
                  <AnimatePresence>
                    {tierItems.map((item) => (
                      <TierItemCard
                        key={item.id}
                        item={item}
                        onRemove={() => moveToTier(item.id, null)}
                        isEditable={!isComplete}
                      />
                    ))}
                  </AnimatePresence>
                  {tierItems.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm py-4">
                      여기에 드래그하세요
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 미배치 아이템 풀 */}
        {!isComplete && unassignedItems.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                배치할 항목들
                <Badge variant="secondary">{unassignedItems.length}개</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {unassignedItems.map((item) => (
                  <TierItemCard key={item.id} item={item} isEditable={true} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 완료 시 액션 버튼들 */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? '생성 중...' : '이미지로 저장'}
              </Button>
              <ShareButtons
                title={`나의 ${categoryName} 계급도`}
                description={`${categoryName} 계급도를 만들어봤어요! 나의 취향을 확인해보세요.`}
                variant="compact"
                className="flex-1"
                imageUrl={getShareImageUrl()}
              />
            </div>

            <div className="text-center">
              <Button variant="link" onClick={() => setIsComplete(false)}>
                계속 수정하기
              </Button>
            </div>
          </motion.div>
        )}

        {/* 빠른 티어 선택 버튼 (미배치 항목용) */}
        {!isComplete && unassignedItems.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            항목을 클릭하면 빠르게 티어를 선택할 수 있어요
          </div>
        )}
      </div>
    </>
  );
}

// 개별 티어 아이템 카드
interface TierItemCardProps {
  item: TierItem;
  onRemove?: () => void;
  isEditable?: boolean;
}

function TierItemCard({ item, onRemove, isEditable = true }: TierItemCardProps) {
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      draggable={isEditable}
      onDragStart={(e) => {
        if ('dataTransfer' in e) {
          (e as unknown as DragEvent).dataTransfer?.setData('itemId', item.id);
        }
      }}
      onClick={() => isEditable && !item.tier && setShowQuickSelect(!showQuickSelect)}
      className={`
        relative bg-white dark:bg-slate-700 rounded-lg overflow-hidden
        ${isEditable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${!item.tier && isEditable ? 'hover:ring-2 ring-accent' : ''}
        transition-all
      `}
    >
      <div className="flex items-center gap-2 p-2 min-w-[100px]">
        {/* 이미지 */}
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">{item.name[0]}</span>
          )}
        </div>

        {/* 텍스트 */}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{item.brand}</p>
          <p className="text-sm font-medium truncate max-w-[80px]">{item.name}</p>
        </div>

        {/* 제거 버튼 */}
        {item.tier && isEditable && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* 빠른 티어 선택 드롭다운 */}
      <AnimatePresence>
        {showQuickSelect && !item.tier && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-600"
          >
            <div className="flex">
              {(['S', 'A', 'B', 'C', 'D'] as TierLevel[]).map((tier) => (
                <button
                  key={tier}
                  onClick={(e) => {
                    e.stopPropagation();
                    const event = new CustomEvent('moveTier', {
                      detail: { itemId: item.id, tier },
                    });
                    window.dispatchEvent(event);
                    setShowQuickSelect(false);
                  }}
                  className="flex-1 py-2 text-sm font-bold hover:opacity-80 transition-opacity"
                  style={{ background: TIER_CONFIG[tier].gradient, color: tier === 'S' || tier === 'A' ? '#000' : '#FFF' }}
                >
                  {tier}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
