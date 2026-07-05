'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User, BookOpen, CalendarCheck, Trophy, CreditCard,
  Brain, Clock, Star, Flame, TrendingUp, Award,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type ParentPayment = {
  id: string;
  courseName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt?: string;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function ParentOverview() {
  const { language, user, enrollments, gamification } = useAppStore();
  const [payments, setPayments] = useState<ParentPayment[]>([]);
  const parentPoints = gamification?.points || 0;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/payments', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : { payments: [] })
      .then((data) => setPayments(data.payments || []))
      .catch((error) => {
        if (!controller.signal.aborted) console.error(error);
      });
    return () => controller.abort();
  }, []);

  const linkedStudents = useMemo(() => {
    const byStudent = new Map<string, {
      id: string;
      name: string;
      enrolledCourses: number;
      attendanceRate: number;
      points: number;
      level: number;
      grades: { course: string; grade: number }[];
      achievements: { id: string; icon: string; title: string }[];
    }>();

    enrollments.forEach((enrollment) => {
      const id = enrollment.studentId;
      const current = byStudent.get(id) || {
        id,
        name: id,
        enrolledCourses: 0,
        attendanceRate: 0,
        points: 0,
        level: 1,
        grades: [],
        achievements: [],
      };
      current.enrolledCourses += 1;
      if (enrollment.grade) {
        current.grades.push({
          course: enrollment.course?.title || enrollment.courseId,
          grade: enrollment.grade,
        });
      }
      byStudent.set(id, current);
    });

    return Array.from(byStudent.values());
  }, [enrollments]);

  const pieData = [
    { name: language === 'ar' ? 'حاضر' : 'Present', value: 85, color: '#10b981' },
    { name: language === 'ar' ? 'غائب' : 'Absent', value: 10, color: '#ef4444' },
    { name: language === 'ar' ? 'متأخر' : 'Late', value: 5, color: '#f59e0b' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Card with Parent Points */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-600 via-emerald-700 to-teal-800 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {t('dashboard.welcome', language)} {user?.name || 'محمد'}
                </h2>
                <p className="text-emerald-100/80">
                  {language === 'ar'
                    ? 'تابع تقدم أبنائك التعليمي'
                    : 'Track your children\'s educational progress'}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-emerald-100/70">
                    {language === 'ar' ? 'نقاط الولي' : 'Parent Points'}
                  </p>
                  <p className="text-lg font-bold">{parentPoints}</p>
                </div>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Linked Students */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          {language === 'ar' ? 'الأبناء المسجلون' : 'Linked Students'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linkedStudents.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t('common.noData', language)}
            </p>
          )}
          {linkedStudents.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg">
                      {student.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base">{student.name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {student.enrolledCourses} {language === 'ar' ? 'دورات' : 'courses'}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarCheck className="w-3 h-3" />
                          {student.attendanceRate}%
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {student.points} {language === 'ar' ? 'نقطة' : 'pts'}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {language === 'ar' ? 'مستوى' : 'Lvl'} {student.level}
                        </span>
                      </div>

                      {/* Grades Mini */}
                      <div className="mt-3 space-y-1.5">
                        {student.grades.map((g, gi) => (
                          g.grade > 0 && (
                            <div key={gi} className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground w-28 truncate">{g.course}</span>
                              <Progress value={g.grade} className="h-1.5 flex-1" />
                              <span className="text-[10px] font-medium w-8 text-end">{g.grade}%</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Attendance Pie */}
                    <div className="w-20 h-20 shrink-0 hidden sm:block">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={18}
                            outerRadius={32}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    {student.achievements.map((ach) => (
                      <Badge
                        key={ach.id}
                        variant="secondary"
                        className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 gap-1"
                      >
                        <span>{ach.icon}</span>
                        {ach.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Reminders */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'تذكيرات الدفع' : 'Payment Reminders'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {t('common.noData', language)}
                  </p>
                )}
                {payments.map((payment, i) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-3 rounded-lg border ${
                      payment.status === 'pending'
                        ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800'
                        : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{payment.courseName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {payment.submittedAt || '-'}
                        </p>
                      </div>
                      <div className="text-end shrink-0 ms-3">
                        <p className="text-sm font-bold">{payment.amount.toLocaleString()} {payment.currency}</p>
                        <Badge
                          variant={payment.status === 'pending' ? 'secondary' : 'default'}
                          className={`text-[10px] mt-0.5 ${
                            payment.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                          }`}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-600" />
                {language === 'ar' ? 'اقتراحات ذكية لدعم أبنائك' : 'AI Suggestions for Your Children'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t('common.noData', language)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Approval Queue */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              {language === 'ar' ? 'طلبات الموافقة' : 'Approval Queue'}
              <Badge variant="secondary" className="text-xs">
                0 {language === 'ar' ? 'معلّق' : 'pending'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t('common.noData', language)}
                </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Parent Engagement Points */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Star className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {language === 'ar' ? 'نقاط مشاركتك كولي أمر' : 'Your Parent Engagement Points'}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Progress value={(parentPoints / 1000) * 100} className="h-2 flex-1" />
                  <span className="text-sm font-bold text-amber-600">{parentPoints}/1000</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar'
                    ? 'واصل متابعة أبنائك والموافقة على الأنشطة لكسب المزيد من النقاط!'
                    : 'Keep tracking your children and approving activities to earn more points!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
