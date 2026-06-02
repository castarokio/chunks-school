'use client';

import { UserPlus, BookOpen, Play, Award } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';

const steps = [
  {
    icon: UserPlus,
    titleKey: 'process.step1',
    descKey: 'process.step1.desc',
    tone: 'bg-primary text-primary-foreground',
  },
  {
    icon: BookOpen,
    titleKey: 'process.step2',
    descKey: 'process.step2.desc',
    tone: 'bg-accent text-accent-foreground',
  },
  {
    icon: Play,
    titleKey: 'process.step3',
    descKey: 'process.step3.desc',
    tone: 'bg-secondary text-secondary-foreground',
  },
  {
    icon: Award,
    titleKey: 'process.step4',
    descKey: 'process.step4.desc',
    tone: 'bg-primary text-primary-foreground',
  },
];

export default function ProcessSection() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  return (
    <section
      className="bg-background px-4 py-20 md:py-28"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-black text-primary md:text-5xl">
            {t('process.title', language)}
          </h2>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-16 h-1 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent" />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.titleKey}
                  className="flex flex-col items-center text-center"
                >
                  {/* Number circle */}
                  <div className="relative mb-6">
                    <div className={`relative flex size-16 items-center justify-center rounded-full text-xl font-black shadow-[0_8px_22px_rgba(16,42,67,0.12)] ${step.tone}`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`mb-4 flex size-12 items-center justify-center rounded-md ${step.tone}`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-black text-foreground">
                    {t(step.titleKey, language)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-7 text-muted-foreground">
                    {t(step.descKey, language)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative">
          {/* Vertical line */}
          <div className="absolute bottom-0 start-6 top-0 w-0.5 bg-border">
            <div className="h-full w-full bg-accent" />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.titleKey}
                  className="flex gap-4 items-start"
                >
                  {/* Number circle */}
                  <div className="relative shrink-0">
                    <div
                      className={`relative flex size-12 items-center justify-center rounded-full text-lg font-black shadow-[0_8px_22px_rgba(16,42,67,0.12)] ${step.tone}`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                      <h3 className="font-black text-foreground">
                        {t(step.titleKey, language)}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {t(step.descKey, language)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
