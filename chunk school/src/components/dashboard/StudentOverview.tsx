'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockEnrollments, mockDashboardStats, mockNotifications, mockCourses } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, CalendarCheck, Trophy, TrendingUp, Star, Flame,
  ArrowUpRight, Brain, Clock, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const progressData = [
  { name: 'سبتمبر', value: 20 },
  { name: 'أكتوبر', value: 35 },
  { name: 'نوفمبر', value: 45 },
  { name: 'ديسمبر', value: 52 },
  { name: 'يناير', value: 60 },
  { name: 'فبراير', value: 65 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function StudentOverview() {
  const { language, user, enrollments, gamification, setDashboardTab } = useAppStore();
  const rtl = isRTL(language);

  const stats = [
    { icon: BookOpen, label: t('dashboard.courses', language), value: enrollments.length || 3, color: 'from-emerald-400 to-emerald-600', change: '+1' },
    { icon: CalendarCheck, label: t('dashboard.attendanceRate', language), value: '91%', color: 'from-teal-400 to-teal-600', change: '+3%' },
    { icon: Trophy, label: t('gamification.points', language), value: gamification?.points || 2450, color: 'from-amber-400 to-amber-600', change: '+120' },
    { icon: TrendingUp, label: t('gamification.rank', language), value: `#${gamification?.rank || 3}`, color: 'from-rose-400 to-rose-600', change: '+2' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-600 via-emerald-700 to-teal-800 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {t('dashboard.welcome', language)} {user?.name || 'أحمد'} 👋
                </h2>
                <p className="text-emerald-100/80 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {gamification?.streak || 7} {t('gamification.streak', language)}
                  <span className="mx-2">•</span>
                  {t('gamification.level', language)} {gamification?.level || 12}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => setDashboardTab('courses')}
                >
                  <BookOpen className="w-4 h-4 me-1.5" />
                  {t('courses.enroll', language)}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                  onClick={() => setDashboardTab('gamification')}
                >
                  <Trophy className="w-4 h-4 me-1.5" />
                  {t('dashboard.gamification', language)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="relative overflow-hidden border-0 hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30">
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'تقدم التعلم' : language === 'fr' ? 'Progrès d\'apprentissage' : 'Learning Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#colorProgress)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                {t('dashboard.notifications', language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mockNotifications.slice(0, 4).map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-lg border text-sm ${
                      n.type === 'achievement' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800' :
                      n.type === 'success' ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800' :
                      'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                  >
                    <p className="font-medium text-xs">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Courses & AI Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Courses Mini */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  {t('dashboard.courses', language)}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setDashboardTab('courses')} className="text-emerald-600">
                  {t('common.view', language)} <ArrowUpRight className="w-3 h-3 ms-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(enrollments.length > 0 ? enrollments : mockEnrollments).map((en) => (
                  <div key={en.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {en.course?.title?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {language === 'ar' ? en.course?.titleAr || en.course?.title : en.course?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={en.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{en.progress}%</span>
                      </div>
                    </div>
                    <Badge variant={en.status === 'approved' ? 'default' : 'secondary'} className="text-xs shrink-0">
                      {en.status === 'approved' ? (language === 'ar' ? 'مفعّل' : 'Active') : (language === 'ar' ? 'معلّق' : 'Pending')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Suggestion */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-600" />
                {t('dashboard.ai.suggestions', language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'ar' ? 'الفرنسية المتوسطة' : 'French Intermediate'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {language === 'ar' ? 'بناءً على تقدمك في الإنجليزية، ننصحك بهذه الدورة' : 'Based on your English progress, we recommend this course'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'ar' ? 'مستكشف العلوم' : 'Science Explorer'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {language === 'ar' ? 'يطابق اهتماماتك العلمية' : 'Matches your scientific interests'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-violet-600 border-violet-200 hover:bg-violet-50"
                  onClick={() => setDashboardTab('ai-suggestions')}
                >
                  {language === 'ar' ? 'المزيد من الاقتراحات' : 'More Suggestions'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
