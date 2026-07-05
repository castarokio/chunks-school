'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, MapPin } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const weekSchedule = [
  { day: 'الأحد', dayEn: 'Sunday', classes: [
    { name: 'إتقان الإنجليزية', nameEn: 'English Mastery', time: '09:00-10:30', color: 'bg-emerald-500', room: 'قاعة A1' },
    { name: 'أساسيات الرياضيات', nameEn: 'Math Fundamentals', time: '10:00-11:30', color: 'bg-teal-500', room: 'قاعة B2' },
  ]},
  { day: 'الإثنين', dayEn: 'Monday', classes: [
    { name: 'الفرنسية المتوسطة', nameEn: 'French Intermediate', time: '14:00-15:30', color: 'bg-amber-500', room: 'قاعة C1' },
  ]},
  { day: 'الثلاثاء', dayEn: 'Tuesday', classes: [
    { name: 'إتقان الإنجليزية', nameEn: 'English Mastery', time: '16:00-17:30', color: 'bg-emerald-500', room: 'قاعة A1' },
  ]},
  { day: 'الأربعاء', dayEn: 'Wednesday', classes: [
    { name: 'أساسيات الرياضيات', nameEn: 'Math Fundamentals', time: '10:00-11:30', color: 'bg-teal-500', room: 'قاعة B2' },
    { name: 'الفنون الرقمية', nameEn: 'Digital Arts', time: '15:00-16:30', color: 'bg-pink-500', room: 'قاعة D1' },
  ]},
  { day: 'الخميس', dayEn: 'Thursday', classes: [
    { name: 'إتقان الإنجليزية', nameEn: 'English Mastery', time: '09:00-10:30', color: 'bg-emerald-500', room: 'قاعة A1' },
  ]},
];

export default function StudentSchedule() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 opacity-80" />
              <div>
                <p className="text-lg font-bold">{language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Schedule'}</p>
                <p className="text-sm opacity-80">{language === 'ar' ? 'الفصل الدراسي الحالي' : 'Current Semester'}</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              {weekSchedule.reduce((c, d) => c + d.classes.length, 0)} {language === 'ar' ? 'حصة' : 'classes'}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {weekSchedule.map((day, i) => (
          <motion.div key={day.day} variants={item}>
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-bold text-center text-emerald-700 dark:text-emerald-400">
                  {language === 'ar' ? day.day : day.dayEn}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {day.classes.length > 0 ? day.classes.map((cls, j) => (
                  <motion.div
                    key={j}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg ${cls.color} text-white shadow-sm`}
                  >
                    <p className="text-xs font-bold">{language === 'ar' ? cls.name : cls.nameEn}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] opacity-90">
                      <Clock className="w-3 h-3" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] opacity-90">
                      <MapPin className="w-3 h-3" />
                      <span>{cls.room}</span>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-xs text-center text-muted-foreground py-4">
                    {language === 'ar' ? 'لا توجد حصص' : 'No classes'}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fee Preview */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              {language === 'ar' ? 'معاينة الرسوم' : 'Fee Preview'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'إتقان الإنجليزية', fee: 15000 },
                { name: 'أساسيات الرياضيات', fee: 10000 },
                { name: 'الفرنسية المتوسطة', fee: 12000 },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b dark:border-gray-800 last:border-0">
                  <span className="text-sm">{c.name}</span>
                  <span className="text-sm font-bold text-emerald-600">{c.fee.toLocaleString()} DZD</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span className="text-lg font-bold text-emerald-600">{37000 .toLocaleString()} DZD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
