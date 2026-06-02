'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockGamification, mockLeaderboard, badgeInfo } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Star, Award, TrendingUp, Medal, Crown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentGamification() {
  const { language, gamification } = useAppStore();
  const rtl = isRTL(language);
  const g = gamification || mockGamification;
  const nextLevelPoints = g.level * 300;
  const currentLevelPoints = (g.level - 1) * 300;
  const progressToNext = ((g.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const pieData = [
    { name: language === 'ar' ? 'حضور' : 'Attendance', value: 40, color: '#10b981' },
    { name: language === 'ar' ? 'درجات' : 'Grades', value: 30, color: '#f59e0b' },
    { name: language === 'ar' ? 'أنشطة' : 'Activities', value: 20, color: '#8b5cf6' },
    { name: language === 'ar' ? 'تفاعل' : 'Engagement', value: 10, color: '#ec4899' },
  ];

  const earnedBadges = g.badges.map(b => ({ id: b, ...badgeInfo[b] })).filter(Boolean);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: t('gamification.points', language), value: g.points, color: 'from-amber-400 to-amber-600' },
          { icon: TrendingUp, label: t('gamification.level', language), value: g.level, color: 'from-emerald-400 to-emerald-600' },
          { icon: Flame, label: t('gamification.streak', language), value: `${g.streak} 🔥`, color: 'from-orange-400 to-red-500' },
          { icon: Medal, label: t('gamification.rank', language), value: `#${g.rank}`, color: 'from-violet-400 to-purple-600' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level Progress */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'التقدم نحو المستوى التالي' : 'Progress to Next Level'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {g.level}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{language === 'ar' ? `المستوى ${g.level}` : `Level ${g.level}`}</span>
                    <span>{g.points} / {nextLevelPoints} {language === 'ar' ? 'نقطة' : 'pts'}</span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextLevelPoints - g.points} {language === 'ar' ? 'نقطة للصعود' : 'pts to level up'}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {g.level + 1}
                </div>
              </div>

              {/* Points Breakdown */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badge Collection */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {t('gamification.badges', language)} ({g.badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {earnedBadges.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.08 }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${badge.color} text-white text-center shadow-sm cursor-pointer relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="text-[10px] font-medium leading-tight">{language === 'ar' ? badge.name : badge.nameEn}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              {t('gamification.leaderboard', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    i === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10' :
                    i === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30' :
                    i === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10' :
                    'bg-gray-50 dark:bg-gray-800/30'
                  } ${entry.name === 'أحمد محمد' ? 'ring-2 ring-emerald-500/30' : ''}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-amber-400 text-white' :
                    i === 1 ? 'bg-gray-300 text-gray-700' :
                    i === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {entry.badge || i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'المستوى' : 'Level'} {entry.level}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold text-emerald-600">{entry.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{t('gamification.points', language)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
