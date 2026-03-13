'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ListPlus, GripVertical, Plus } from 'lucide-react';
import { useTranslations } from '@/i18n';

export function CreateGuideSection() {
  const t = useTranslations('openHub');

  const steps = [
    {
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      titleKey: 'guideStep1Title',
      descKey: 'guideStep1Desc',
    },
    {
      icon: ListPlus,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      titleKey: 'guideStep2Title',
      descKey: 'guideStep2Desc',
    },
    {
      icon: GripVertical,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/10',
      titleKey: 'guideStep3Title',
      descKey: 'guideStep3Desc',
    },
  ];

  return (
    <section className="py-6 md:py-8 bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl overflow-hidden">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{t('guideTitle')}</h2>
        <p className="text-sm md:text-base text-muted-foreground">{t('guideSubtitle')}</p>
      </div>

      {/* 모바일: 가로 스크롤 가능한 컴팩트 레이아웃 / 데스크탑: 그리드 */}
      <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2 md:pb-0 md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[140px] md:w-auto"
            >
              <Card className="h-full text-center">
                <CardContent className="p-3 md:p-6">
                  <div className="relative mb-2 md:mb-4 flex justify-center">
                    <div
                      className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${step.bgColor} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 md:h-7 md:w-7" style={{ color: step.color.includes('amber') ? '#F59E0B' : step.color.includes('emerald') ? '#10B981' : '#3B82F6' }} />
                    </div>
                    <div className="absolute -top-1 right-1/4 md:-right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary text-white text-[10px] md:text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xs md:text-base mb-1 md:mb-2 whitespace-nowrap">{t(step.titleKey)}</h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground line-clamp-2">{t(step.descKey)}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Button size="default" className="bg-accent hover:bg-accent/90 text-sm md:text-base" asChild>
          <Link href="/open/create">
            <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            {t('startCreating')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
