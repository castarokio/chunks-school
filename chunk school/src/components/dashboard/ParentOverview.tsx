'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import {
  mockLinkedStudents,
  mockParentPayments,
  mockParentSuggestions,
  mockApprovalQueue,
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User, BookOpen, CalendarCheck, Trophy, CreditCard,
  Brain, CheckCircle2, XCircle, Clock, Star, Flame,
  TrendingUp, Award, Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type ApprovalItem = Omit<(typeof mockApprovalQueue)[number], 'status'> & {
  status: 'pending' | 'approved' | 'rejected';
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
  const { language, user } = useAppStore();
  const rtl = isRTL(language);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(mockApprovalQueue);
  const [parentPoints] = useState(580);

  const pieData = [
    { name: language === 'ar' ? 'حاضر' : 'Present', value: 85, color: '#10b981' },
    { name: language === 'ar' ? 'غائب' : 'Absent', value: 10, color: '#ef4444' },
    { name: language === 'ar' ? 'متأخر' : 'Late', value: 5, color: '#f59e0b' },
  ];

  const handleApproval = (id: string, approved: boolean) => {
    setApprovalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: approved ? 'approved' as const : 'rejected' as const } : item))
    );
  };

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
          {mockLinkedStudents.map((student, i) => (
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
                {mockParentPayments.map((payment, i) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-3 rounded-lg border ${
                      payment.status === 'upcoming'
                        ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800'
                        : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{payment.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {payment.dueDate}
                        </p>
                      </div>
                      <div className="text-end shrink-0 ms-3">
                        <p className="text-sm font-bold">{payment.amount.toLocaleString()} {language === 'ar' ? 'د.ج' : 'DZD'}</p>
                        <Badge
                          variant={payment.status === 'upcoming' ? 'secondary' : 'default'}
                          className={`text-[10px] mt-0.5 ${
                            payment.status === 'upcoming'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                          }`}
                        >
                          {payment.status === 'upcoming'
                            ? (language === 'ar' ? 'قادم' : 'Upcoming')
                            : (language === 'ar' ? 'مدفوع' : 'Paid')}
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
                {mockParentSuggestions.map((suggestion, i) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${
                        suggestion.type === 'academic' ? 'text-emerald-500' :
                        suggestion.type === 'enrichment' ? 'text-amber-500' :
                        'text-orange-500'
                      }`} />
                      <p className="text-sm text-foreground">{suggestion.text}</p>
                    </div>
                  </motion.div>
                ))}
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
                {approvalItems.filter((a) => a.status === 'pending').length} {language === 'ar' ? 'معلّق' : 'pending'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {approvalItems.map((aq, i) => (
                  <motion.div
                    key={aq.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: rtl ? 20 : -20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border ${
                      aq.status === 'pending'
                        ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/5 dark:border-amber-800'
                        : aq.status === 'approved'
                        ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/5 dark:border-emerald-800'
                        : 'border-red-200 bg-red-50/50 dark:bg-red-900/5 dark:border-red-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{aq.activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {aq.studentName} • {aq.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {aq.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3"
                            onClick={() => handleApproval(aq.id, true)}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 me-1" />
                            {language === 'ar' ? 'موافقة' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-3"
                            onClick={() => handleApproval(aq.id, false)}
                          >
                            <XCircle className="w-3.5 h-3.5 me-1" />
                            {language === 'ar' ? 'رفض' : 'Reject'}
                          </Button>
                        </>
                      ) : (
                        <Badge
                          className={`text-xs ${
                            aq.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                          }`}
                        >
                          {aq.status === 'approved'
                            ? (language === 'ar' ? 'تمت الموافقة ✓' : 'Approved ✓')
                            : (language === 'ar' ? 'مرفوض ✗' : 'Rejected ✗')}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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
