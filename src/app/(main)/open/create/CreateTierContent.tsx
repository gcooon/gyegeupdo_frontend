'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
import type { TierChartItem, TierChartData, UserTierChart, TierChartLanguage } from '@/types/tier';
import { LANGUAGE_OPTIONS } from '@/types/tier';
import Link from 'next/link';
import { useTranslations } from '@/i18n';

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
  const t = useTranslations('tierChart');
  const tCommon = useTranslations('common');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [language, setLanguage] = useState<TierChartLanguage>('ko');
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
      router.push('/login?redirect=/open/create');
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
      setError(t('titleRequired'));
      return;
    }

    if (filledItems < 1) {
      setError(t('itemRequired'));
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
        language,
      });

      if (response.data.success) {
        setCreatedChart(response.data.data);
        setSuccess(true);
        setShowConfetti(true);
      } else {
        setError(response.data.message || t('saveFailed'));
      }
    } catch (err) {
      setError(t('saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
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
      link.download = `${title || '계급도'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Image generation failed:', err);
      alert(t('imageGenFailed'));
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
              <h1 className="text-2xl font-bold mb-2">{t('created')}</h1>
              <p className="text-muted-foreground">
                {t('shareDesc')}
              </p>
            </div>

            {/* 미리보기 */}
            <TierPreview
              ref={tierListRef}
              title={title}
              tierData={tierData}
              authorName={createdChart.user_nickname}
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
                {isDownloading ? tCommon('loading') : t('downloadImage')}
              </Button>
              <ShareButtons
                title={createdChart.title}
                description={createdChart.description || t('shareCreated')}
                variant="compact"
                className="flex-1"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" asChild>
                <Link href="/open">
                  {t('backToList')}
                </Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href={`/open/${createdChart.slug}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t('viewChart')}
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
      {/* 헤더 - 더 임팩트 있게 */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/open">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('backToList')}
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800">
              {t('create')}
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              {t('createDesc')}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* 기본 정보 - 깔끔한 스타일 */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg font-bold text-gray-800">{t('basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                {t('titleLabel')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t('titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="h-12 text-base border-gray-200 focus:border-accent focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                {t('descLabel')}
              </Label>
              <Textarea
                id="description"
                placeholder={t('descPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-accent focus:ring-accent/20 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">{t('visibility')}</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v as 'public' | 'private')}>
                  <SelectTrigger className="w-[150px] h-11 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <span className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-500" />
                        {t('public')}
                      </span>
                    </SelectItem>
                    <SelectItem value="private">
                      <span className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-gray-400" />
                        {t('private')}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">{t('language')}</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as TierChartLanguage)}>
                  <SelectTrigger className="w-[160px] h-11 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 티어 입력 - TierMaker 스타일 */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">{t('tierConfig')}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">각 티어에 항목을 추가하세요</p>
            </div>
            <Badge className="bg-accent text-white px-3 py-1 text-sm font-semibold">
              {filledItems}개 항목
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={tierListRef} className="rounded-b-xl overflow-hidden shadow-inner">
              {TIERS.map((tier) => (
                <TierRow
                  key={tier}
                  tier={tier}
                  items={tierData[tier]}
                  onAddItem={() => addItem(tier)}
                  onUpdateItem={(id, field, value) => updateItem(tier, id, field, value)}
                  onRemoveItem={(id) => removeItem(tier, id)}
                  onMoveItem={(id, toTier) => moveItem(tier, toTier, id)}
                  t={t}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 - 더 눈에 띄게 */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button variant="outline" asChild className="h-12 px-6 border-gray-300">
            <Link href="/open">{tCommon('cancel')}</Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || filledItems < 1}
            className="h-12 px-8 bg-accent hover:bg-accent/90 text-white font-bold text-base shadow-lg shadow-accent/25 disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-5 w-5 mr-2" />
            )}
            {t('saveChart')}
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
  t: (key: string, params?: Record<string, string | number>) => string;
}

// 계급도 스타일 색상 (한국 계급 테마)
const TIER_COLORS: Record<TierLevel, { bg: string; text: string; light: string; label: string; emoji: string }> = {
  S: { bg: '#FFD700', text: '#000', light: '#FFFBEB', label: '황제', emoji: '👑' },
  A: { bg: '#9370DB', text: '#FFF', light: '#FAF5FF', label: '왕', emoji: '🏰' },
  B: { bg: '#4169E1', text: '#FFF', light: '#EFF6FF', label: '양반', emoji: '🎓' },
  C: { bg: '#3CB371', text: '#FFF', light: '#ECFDF5', label: '중인', emoji: '🏠' },
  D: { bg: '#8B7355', text: '#FFF', light: '#FAF5F0', label: '평민', emoji: '🌾' },
};

function TierRow({ tier, items, onAddItem, onUpdateItem, onRemoveItem, onMoveItem, t }: TierRowProps) {
  const colors = TIER_COLORS[tier];

  return (
    <div className="flex border-b border-gray-200 last:border-b-0">
      {/* 티어 라벨 - 한국 계급 스타일 */}
      <div
        className="w-16 md:w-20 flex flex-col items-center justify-center shrink-0 py-2"
        style={{ backgroundColor: colors.bg }}
      >
        <span className="text-lg">{colors.emoji}</span>
        <span
          className="font-bold text-sm md:text-base"
          style={{ color: colors.text }}
        >
          {colors.label}
        </span>
      </div>

      {/* 아이템 영역 - 밝은 테마 */}
      <div
        className="flex-1 p-2 min-h-[70px]"
        style={{ backgroundColor: colors.light }}
      >
        <div className="space-y-2">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="group"
              >
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all">
                  {/* 순서 표시 */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {index + 1}
                  </div>

                  {/* 입력 필드 */}
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="항목 이름"
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                      className="h-8 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 font-medium text-sm text-gray-800 placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="이유 (선택)"
                      value={item.reason || ''}
                      onChange={(e) => onUpdateItem(item.id, 'reason', e.target.value)}
                      className="h-8 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 text-sm text-gray-600 placeholder:text-gray-400 hidden md:block"
                    />
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Select onValueChange={(v) => onMoveItem(item.id, v as TierLevel)}>
                      <SelectTrigger className="w-14 h-7 text-xs border-gray-200 bg-white">
                        <SelectValue placeholder="이동" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIERS.filter((t) => t !== tier).map((t) => (
                          <SelectItem key={t} value={t}>
                            <span className="text-xs">
                              {TIER_COLORS[t].emoji} {TIER_COLORS[t].label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 항목 추가 버튼 */}
          <Button
            variant="outline"
            onClick={onAddItem}
            className="w-full h-9 border border-dashed border-gray-300 hover:border-accent hover:bg-accent/5 text-gray-500 hover:text-accent rounded-lg transition-all text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            추가
          </Button>
        </div>
      </div>
    </div>
  );
}

// 티어 미리보기 (이미지 생성용) - 한국 계급 스타일
interface TierPreviewProps {
  title: string;
  tierData: Record<TierLevel, TierItemInput[]>;
  authorName?: string;
}

const TierPreview = ({ title, tierData, authorName }: TierPreviewProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-xl bg-white border border-gray-200">
      {/* 제목 */}
      <div className="bg-slate-800 px-4 py-3">
        <h2 className="text-lg font-bold text-white text-center">{title}</h2>
      </div>

      {/* 티어 */}
      {TIERS.map((tier) => {
        const colors = TIER_COLORS[tier];
        const items = tierData[tier].filter((item) => item.name.trim());

        return (
          <div key={tier} className="flex border-b border-gray-200 last:border-b-0">
            {/* 티어 라벨 */}
            <div
              className="w-16 md:w-20 flex flex-col items-center justify-center shrink-0 py-2"
              style={{ backgroundColor: colors.bg }}
            >
              <span className="text-base">{colors.emoji}</span>
              <span
                className="font-bold text-xs md:text-sm"
                style={{ color: colors.text }}
              >
                {colors.label}
              </span>
            </div>

            {/* 아이템 */}
            <div
              className="flex-1 p-2 flex flex-wrap gap-1.5 items-center min-h-[50px]"
              style={{ backgroundColor: colors.light }}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white px-3 py-1.5 rounded-md text-xs font-medium text-gray-800 shadow-sm border border-gray-100"
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-xs italic">-</span>
              )}
            </div>
          </div>
        );
      })}

      {/* 워터마크 */}
      <div className="bg-gray-50 text-center py-2 text-xs text-gray-400 border-t">
        tier-chart.com{authorName && ` · by ${authorName}`}
      </div>
    </div>
  );
};
