'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockSkills, badgeInfo } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Lock, Star, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentSkills() {
  const { language, skills } = useAppStore();
  const rtl = isRTL(language);
  const mySkills = skills.length > 0 ? skills : mockSkills;

  const radarData = mySkills.map(s => ({
    subject: s.name,
    value: s.level * 10,
    fullMark: 100,
  }));

  const allBadges = Object.entries(badgeInfo).map(([key, val]) => ({
    id: key,
    ...val,
    earned: mockSkills.some(s => s.badge === val.icon) || Math.random() > 0.5,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Skills Radar Chart */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {language === 'ar' ? 'خريطة المهارات' : 'Skills Map'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name={language === 'ar' ? 'المستوى' : 'Level'} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill Bars */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'تفاصيل المهارات' : 'Skill Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mySkills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skill.badge}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}/10</span>
                      </div>
                      <Progress value={skill.level * 10} className="h-2" />
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {skill.category}
                    </Badge>
                  </div>
                </motion.div>
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
              <Star className="w-4 h-4 text-amber-500" />
              {language === 'ar' ? 'مجموعة الشارات' : 'Badge Collection'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05, rotate: badge.earned ? [0, -3, 3, 0] : 0 }}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                    badge.earned
                      ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-1.5">{badge.icon}</div>
                  <p className="text-xs font-medium">{language === 'ar' ? badge.name : badge.nameEn}</p>
                  {!badge.earned && <Lock className="w-3 h-3 absolute top-2 end-2 text-gray-400" />}
                  {badge.earned && (
                    <motion.div
                      className="absolute -top-1 -end-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                    >
                      <span className="text-[8px] text-white font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
