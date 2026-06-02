'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockTestimonials } from '@/lib/mock-data';
import { Star } from 'lucide-react';

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

function AvatarPlaceholder({ name, index }: { name: string; index: number }) {
  const initial = name.charAt(0);

  return (
    <div
      className={`flex size-14 items-center justify-center rounded-full text-xl font-black shadow-lg ${
        index % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
      }`}
    >
      {initial}
    </div>
  );
}

export default function TestimonialsSection() {
  const { language } = useAppStore();
  const rtl = isRTL(language);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % mockTestimonials.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);
  }, []);

  return (
    <section
      className="overflow-hidden bg-background px-4 py-20 md:py-28"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-black text-primary md:text-5xl">
            {t('testimonials.title', language)}
          </h2>
          <p className="text-lg leading-8 text-muted-foreground md:text-xl">
            {t('testimonials.subtitle', language)}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="relative h-[320px] md:h-[280px]">
            <div className="absolute inset-0">
              <Card className="brand-card h-full">
                <CardContent className="p-8 md:p-10 h-full flex flex-col justify-center items-center text-center gap-4">
                  {/* Quote icon */}
                  <Quote className="size-10 rotate-180 text-accent" aria-hidden="true" />

                  {/* Content */}
                  <p className="max-w-xl text-base italic leading-8 text-foreground md:text-lg">
                    &ldquo;{mockTestimonials[activeIndex].content}&rdquo;
                  </p>

                  {/* Avatar + Info */}
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <AvatarPlaceholder
                      name={mockTestimonials[activeIndex].name}
                      index={activeIndex}
                    />
                    <div>
                      <p className="font-black text-foreground">
                        {mockTestimonials[activeIndex].name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mockTestimonials[activeIndex].role}
                      </p>
                    </div>
                    <RatingStars rating={mockTestimonials[activeIndex].rating} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className={`absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rtl ? 'right-0 md:right-[-2rem]' : 'left-0 md:left-[-2rem]'}`}
            aria-label="Previous Testimonial"
          >
            {rtl ? <ChevronRight className="size-5" aria-hidden="true" /> : <ChevronLeft className="size-5" aria-hidden="true" />}
          </button>
          <button
            onClick={goToNext}
            className={`absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rtl ? 'left-0 md:left-[-2rem]' : 'right-0 md:right-[-2rem]'}`}
            aria-label="Next Testimonial"
          >
            {rtl ? <ChevronLeft className="size-5" aria-hidden="true" /> : <ChevronRight className="size-5" aria-hidden="true" />}
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {mockTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? 'h-3 w-8 bg-primary'
                  : 'size-3 bg-muted hover:bg-accent'
              }`}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
