'use client';

import {
  Brain,
  Trophy,
  Activity,
  Shield,
  Languages,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';

const features = [
  {
    icon: Brain,
    titleKey: 'feature.ai.title',
    descKey: 'feature.ai.desc',
    tone: 'bg-primary text-primary-foreground',
  },
  {
    icon: Trophy,
    titleKey: 'feature.gamification.title',
    descKey: 'feature.gamification.desc',
    tone: 'bg-accent text-accent-foreground',
  },
  {
    icon: Activity,
    titleKey: 'feature.realtime.title',
    descKey: 'feature.realtime.desc',
    tone: 'bg-secondary text-secondary-foreground',
  },
  {
    icon: Shield,
    titleKey: 'feature.security.title',
    descKey: 'feature.security.desc',
    tone: 'bg-primary text-primary-foreground',
  },
  {
    icon: Languages,
    titleKey: 'feature.multilang.title',
    descKey: 'feature.multilang.desc',
    tone: 'bg-secondary text-secondary-foreground',
  },
  {
    icon: BookOpen,
    titleKey: 'feature.courses.title',
    descKey: 'feature.courses.desc',
    tone: 'bg-accent text-accent-foreground',
  },
];

export default function FeaturesSection() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  return (
    <section
      className="school-grid bg-background px-4 py-20 md:py-28"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-black text-primary md:text-5xl">
            {t('features.title', language)}
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            {t('features.subtitle', language)}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
              >
                <Card
                  className="brand-card group relative h-full overflow-hidden rounded-lg transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

                  <CardContent className="relative z-10 flex flex-col items-start gap-5 p-6">
                    <div
                      className={`flex size-12 items-center justify-center rounded-md ${feature.tone}`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </div>

                    <h3 className="text-xl font-black text-foreground">
                      {t(feature.titleKey, language)}
                    </h3>

                    <p className="text-sm leading-7 text-muted-foreground">
                      {t(feature.descKey, language)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
