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
    <section className="py-8 bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6 rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{t('guideTitle')}</h2>
        <p className="text-muted-foreground">{t('guideSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full text-center">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <div
                      className={`w-14 h-14 mx-auto rounded-2xl ${step.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-7 w-7 bg-gradient-to-r ${step.color} bg-clip-text`} style={{ color: step.color.includes('amber') ? '#F59E0B' : step.color.includes('emerald') ? '#10B981' : '#3B82F6' }} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-2">{t(step.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
          <Link href="/open/create">
            <Plus className="h-5 w-5 mr-2" />
            {t('startCreating')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
