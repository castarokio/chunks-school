'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';

const trustSignals = [
  { icon: Users, value: '1,200+', label: 'Active learners' },
  { icon: BookOpenCheck, value: '38', label: 'Curated courses' },
  { icon: CalendarCheck, value: '94%', label: 'Attendance clarity' },
];

export default function HeroSection() {
  const { language, setCurrentView } = useAppStore();
  const rtl = isRTL(language);
  const reduceMotion = useReducedMotion();

  const goToCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      className="brand-shell school-grid relative min-h-dvh overflow-hidden px-4 pb-16 pt-24 md:px-6 md:pb-20 md:pt-28"
      dir={rtl ? 'rtl' : 'ltr'}
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="mx-auto grid min-h-[calc(100dvh-9rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative z-10 flex flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-3 py-2 text-sm font-semibold text-primary shadow-sm">
            <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
            <span>{language === 'ar' ? 'تعلم موثوق، متابعة واضحة' : language === 'fr' ? 'Apprentissage fiable, suivi clair' : 'Trusted Learning, Clear Progress'}</span>
          </div>

          <h1
            id="hero-title"
            className="max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-normal text-primary md:text-7xl lg:text-8xl"
          >
            {t('hero.title', language)}
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-2xl font-semibold leading-tight text-foreground md:text-3xl">
            {t('hero.subtitle', language)}
          </p>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {t('hero.description', language)}
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              onClick={() => setCurrentView('register')}
              className="h-14 bg-accent px-7 text-base font-black text-accent-foreground hover:bg-accent/90"
            >
              <GraduationCap className="size-5" aria-hidden="true" />
              {t('hero.cta', language)}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={goToCourses}
              className="h-14 border-primary/20 bg-card px-7 text-base font-bold text-primary hover:bg-secondary"
            >
              {t('hero.cta2', language)}
              <ArrowRight className={`size-5 ${rtl ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.label}
                  className="brand-card rounded-lg p-4"
                >
                  <Icon className="mb-3 size-5 text-accent" aria-hidden="true" />
                  <p className="text-2xl font-black text-primary">{signal.value}</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{signal.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">
          <div className="brand-card relative overflow-hidden rounded-xl p-3">
            <div className="absolute right-6 top-6 z-10 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_rgba(16,42,67,0.16)]">
              <Sparkles className="me-2 inline size-4 text-accent" aria-hidden="true" />
              Live Progress
            </div>
            <Image
              src="/hero-learning-lab.svg"
              alt="Illustration of a modern learning dashboard, classroom board, and progress markers"
              width={1200}
              height={900}
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
