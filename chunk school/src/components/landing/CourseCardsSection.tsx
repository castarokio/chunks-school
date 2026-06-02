'use client';

import type { ElementType } from 'react';
import { useState } from 'react';
import { BookOpen, Brush, FlaskConical, Languages, MonitorCog, Star, Users, Sigma } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockCourses } from '@/lib/mock-data';

const categoryIcons: Record<string, ElementType> = {
  language: Languages,
  math: Sigma,
  science: FlaskConical,
  art: Brush,
  tech: MonitorCog,
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : i < rating
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function CourseCard({ course, language }: { course: typeof mockCourses[0]; language: 'ar' | 'en' | 'fr' }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const rtl = isRTL(language);

  const title = language === 'ar' && course.titleAr ? course.titleAr
    : language === 'fr' && course.titleFr ? course.titleFr
    : course.title;

  const description = language === 'ar' && course.descriptionAr ? course.descriptionAr
    : language === 'fr' && course.descriptionFr ? course.descriptionFr
    : course.description;

  const levelKey = course.level === 'beginner' ? 'courses.beginner'
    : course.level === 'intermediate' ? 'courses.intermediate'
    : 'courses.advanced';

  const levelColors: Record<string, string> = {
    beginner: 'bg-secondary text-secondary-foreground',
    intermediate: 'bg-accent text-accent-foreground',
    advanced: 'bg-primary text-primary-foreground',
  };

  return (
    <div
      className="relative h-[380px] perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-300 ease-out ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side */}
        <Card
          className="brand-card absolute inset-0 overflow-hidden rounded-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Image placeholder */}
          <div className="relative h-40 overflow-hidden bg-primary">
            <div className="absolute inset-0 school-grid opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              {(() => {
                const CategoryIcon = categoryIcons[course.category] || BookOpen;
                return <CategoryIcon className="size-16 text-accent" aria-hidden="true" />;
              })()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* Level badge */}
            <Badge
              className={`absolute top-3 ${rtl ? 'left-3' : 'right-3'} text-xs font-bold ${levelColors[course.level] || ''}`}
            >
              {t(levelKey, language)}
            </Badge>
          </div>

          <CardContent className="p-4 pt-4 flex flex-col gap-2">
            <h3 className="line-clamp-1 text-lg font-black leading-tight text-foreground">
              {title}
            </h3>
            <RatingStars rating={course.rating || 0} />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="size-3.5" aria-hidden="true" />
                <span>{course.enrolledCount}/{course.capacity}</span>
              </div>
              <span className="font-black text-primary">
                {course.price.toLocaleString()} {course.currency}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {course.teacherName}
            </div>
          </CardContent>
        </Card>

        {/* Back side */}
        <Card
          className="brand-card absolute inset-0 overflow-hidden rounded-lg bg-secondary"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div>
              <Badge className={`mb-3 ${levelColors[course.level] || ''}`}>
                {t(levelKey, language)}
              </Badge>
              <h3 className="mb-3 text-lg font-black text-foreground">
                {title}
              </h3>
              <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-between">
                <RatingStars rating={course.rating || 0} />
                <span className="font-black text-primary">
                  {course.price.toLocaleString()} {course.currency}
                </span>
              </div>
              <Button className="w-full">
                {t('courses.enroll', language)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const categories = ['all', 'language', 'science', 'math', 'art'];

export default function CourseCardsSection() {
  const { language } = useAppStore();
  const rtl = isRTL(language);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCourses = activeCategory === 'all'
    ? mockCourses
    : mockCourses.filter((c) => c.category === activeCategory);

  const categoryLabel = (cat: string) => {
    if (cat === 'all') return language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All';
    return t(`courses.category.${cat === 'language' ? 'language' : cat === 'science' ? 'science' : cat === 'math' ? 'math' : 'art'}`, language);
  };

  return (
    <section
      className="bg-secondary/40 px-4 py-20 md:py-28"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-black text-primary md:text-5xl">
            {t('courses.title', language)}
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            {t('courses.subtitle', language)}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  min-h-11 rounded-full px-5 py-2 text-sm font-bold transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  ${activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(16,42,67,0.12)]'
                    : 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-primary'
                  }
                `}
              >
                {categoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}
