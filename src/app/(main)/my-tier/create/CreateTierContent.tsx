'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShareButtons } from '@/components/share/ShareButtons';
import { Confetti } from '@/components/effects/Confetti';
import {
  Plus,
  X,
  Save,
  Eye,
  EyeOff,
  Loader2,
  GripVertical,
  Sparkles,
  Crown,
  Medal,
  Award,
  Download,
  ChevronLeft,
  Trash2,
} from 'lucide-react';
import { TIER_CONFIG, TierLevel } from '@/lib/tier';
import type { TierChartItem, TierChartData, UserTierChart } from '@/types/tier';
import Link from 'next/link';

const TIER_ICONS: Record<TierLevel, React.ElementType> = {
  S: Crown,
  A: Medal,
  B: Award,
  C: Sparkles,
  D: Sparkles,
};

const TIERS: TierLevel[] = ['S', 'A', 'B', 'C', 'D'];

interface TierItemInput extends TierChartItem {
  id: string;
}

export function CreateTierContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [tierData, setTierData] = useState<Record<TierLevel, TierItemInput[]>>({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdChart, setCreatedChart] = useState<UserTierChart | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const tierListRef = useRef<HTMLDivElement>(null);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/my-tier/create');
    }
  }, [authLoading, isAuthenticated, router]);

  // 새 아이템 추가
  const addItem = (tier: TierLevel) => {
    const newItem: TierItemInput = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      reason: '',
    };
    setTierData((prev) => ({
      ...prev,
      [tier]: [...prev[tier], newItem],
    }));
  };

  // 아이템 수정
  const updateItem = (tier: TierLevel, itemId: string, field: keyof TierChartItem, value: string) => {
    setTierData((prev) => ({
      ...prev,
      [tier]: prev[tier].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  // 아이템 삭제
  const removeItem = (tier: TierLevel, itemId: string) => {
    setTierData((prev) => ({
      ...prev,
      [tier]: prev[tier].filter((item) => item.id !== itemId),
    }));
  };

  // 아이템 이동
  const moveItem = (fromTier: TierLevel, toTier: TierLevel, itemId: string) => {
    const item = tierData[fromTier].find((i) => i.id === itemId);
    if (!item) return;

    setTierData((prev) => ({
      ...prev,
      [fromTier]: prev[fromTier].filter((i) => i.id !== itemId),
      [toTier]: [...prev[toTier], item],
    }));
  };

  // 총 아이템 수
  const totalItems = Object.values(tierData).reduce((sum, items) => sum + items.length, 0);
  const filledItems = Object.values(tierData)
    .flat()
    .filter((item) => item.name.trim() !== '').length;

  // 제출
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (filledItems < 1) {
      setError('최소 1개 이상의 항목을 추가해주세요.');
      return;
    }

    // API용 데이터 변환
    const apiTierData: TierChartData = {};
    for (const tier of TIERS) {
      const items = tierData[tier]
        .filter((item) => item.name.trim() !== '')
        .map(({ name, reason }) => ({
          name: name.trim(),
          reason: reason?.trim() || undefined,
        }));
      if (items.length > 0) {
        apiTierData[tier] = items;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post<{
        success: boolean;
        data: UserTierChart;
        message: string;
      }>('/tiers/user-charts/', {
        title: title.trim(),
        description: description.trim(),
        tier_data: apiTierData,
        visibility,
      });

      if (response.data.success) {
        setCreatedChart(response.data.data);
        setSuccess(true);
        setShowConfetti(true);
      } else {
        setError(response.data.message || '계급도 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('계급도 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 다운로드
  const handleDownload = async () => {
    if (!tierListRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#1F2937',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${title || '계급도'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  // 성공 화면
  if (success && createdChart) {
    return (
      <>
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="container py-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-8">
              <Sparkles className="h-16 w-16 text-accent mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">계급도가 완성되었습니다!</h1>
              <p className="text-muted-foreground">
                친구들과 공유하고 의견을 나눠보세요
              </p>
            </div>

            {/* 미리보기 */}
            <TierPreview
              ref={tierListRef}
              title={title}
              tierData={tierData}
            />

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? '생성 중...' : '이미지로 저장'}
              </Button>
              <ShareButtons
                title={createdChart.title}
                description={createdChart.description || '나만의 계급도를 만들었어요!'}
                variant="compact"
                className="flex-1"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" asChild>
                <Link href="/my-tier">
                  목록으로
                </Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href={`/my-tier/${createdChart.slug}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  계급도 보기
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/my-tier">
            <ChevronLeft className="h-4 w-4 mr-1" />
            목록으로
          </Link>
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-accent" />
          나만의 계급도 만들기
        </h1>
        <p className="text-muted-foreground mt-1">
          어떤 주제든 가능해요! 티어를 만들고 공유해보세요.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="예: 라면 계급도, 카페 계급도, 게임 캐릭터 계급도..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택)</Label>
              <Textarea
                id="description"
                placeholder="계급도에 대한 간단한 설명을 적어주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>공개 설정</Label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as 'public' | 'private')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      공개
                    </span>
                  </SelectItem>
                  <SelectItem value="private">
                    <span className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      비공개
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 티어 입력 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">티어 구성</CardTitle>
            <Badge variant="secondary">{filledItems}개 항목</Badge>
          </CardHeader>
          <CardContent>
            <div ref={tierListRef} className="rounded-xl overflow-hidden">
              {TIERS.map((tier) => (
                <TierRow
                  key={tier}
                  tier={tier}
                  items={tierData[tier]}
                  onAddItem={() => addItem(tier)}
                  onUpdateItem={(id, field, value) => updateItem(tier, id, field, value)}
                  onRemoveItem={(id) => removeItem(tier, id)}
                  onMoveItem={(id, toTier) => moveItem(tier, toTier, id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/my-tier">취소</Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || filledItems < 1}
            className="bg-accent hover:bg-accent/90 min-w-[120px]"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TierRowProps {
  tier: TierLevel;
  items: TierItemInput[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof TierChartItem, value: string) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (id: string, toTier: TierLevel) => void;
}

function TierRow({ tier, items, onAddItem, onUpdateItem, onRemoveItem, onMoveItem }: TierRowProps) {
  const config = TIER_CONFIG[tier];
  const TierIcon = TIER_ICONS[tier];

  return (
    <div className="flex min-h-[100px]">
      {/* 티어 라벨 */}
      <div
        className="w-20 md:w-24 flex flex-col items-center justify-center shrink-0 relative border-r-2 border-white/30"
        style={{ background: config.gradient }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <span className="text-xl relative z-10">
          {config.emoji}
        </span>
        <span
          className="font-black text-lg md:text-xl relative z-10"
          style={{
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {config.label}
        </span>
        <span
          className="text-[10px] font-bold relative z-10"
          style={{
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          ({tier}티어)
        </span>
      </div>

      {/* 아이템 영역 */}
      <div className="flex-1 p-3 bg-slate-800/50 space-y-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-2 bg-slate-700/50 rounded-lg p-2"
            >
              <GripVertical className="h-5 w-5 text-slate-500 mt-2 shrink-0" />
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="항목 이름"
                  value={item.name}
                  onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                  className="bg-slate-600/50 border-slate-500"
                />
                <Input
                  placeholder="선정 이유 (선택)"
                  value={item.reason || ''}
                  onChange={(e) => onUpdateItem(item.id, 'reason', e.target.value)}
                  className="bg-slate-600/50 border-slate-500 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Select onValueChange={(v) => onMoveItem(item.id, v as TierLevel)}>
                  <SelectTrigger className="w-[70px] h-8 text-xs">
                    <SelectValue placeholder="이동" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.filter((t) => t !== tier).map((t) => (
                      <SelectItem key={t} value={t}>
                        <span
                          className="font-bold"
                          style={{ color: TIER_CONFIG[t].color }}
                        >
                          {TIER_CONFIG[t].label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="sm"
          onClick={onAddItem}
          className="w-full border-2 border-dashed border-slate-600 hover:border-accent text-slate-400 hover:text-accent"
        >
          <Plus className="h-4 w-4 mr-1" />
          항목 추가
        </Button>
      </div>
    </div>
  );
}

// 티어 미리보기 (이미지 생성용)
interface TierPreviewProps {
  title: string;
  tierData: Record<TierLevel, TierItemInput[]>;
}

const TierPreview = ({ title, tierData }: TierPreviewProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-slate-900">
      {/* 제목 */}
      <div className="bg-gradient-to-r from-accent to-primary p-4 text-center">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      {/* 티어 */}
      {TIERS.map((tier) => {
        const config = TIER_CONFIG[tier];
        const items = tierData[tier].filter((item) => item.name.trim());

        return (
          <div key={tier} className="flex min-h-[60px]">
            <div
              className="w-20 flex flex-col items-center justify-center shrink-0 relative border-r-2 border-white/30"
              style={{ background: config.gradient }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <span className="text-lg relative z-10">{config.emoji}</span>
              <span
                className="font-black text-lg relative z-10"
                style={{
                  color: '#fff',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {config.label}
              </span>
            </div>
            <div className="flex-1 p-2 bg-slate-800/50 flex flex-wrap gap-2 items-center">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/10 px-3 py-1.5 rounded-lg text-sm text-white"
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <span className="text-slate-500 text-sm">-</span>
              )}
            </div>
          </div>
        );
      })}

      {/* 워터마크 */}
      <div className="bg-slate-900 text-center py-2 text-xs text-slate-500">
        gyegeupdo.kr
      </div>
    </div>
  );
};
