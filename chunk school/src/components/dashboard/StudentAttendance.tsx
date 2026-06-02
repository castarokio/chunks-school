'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CalendarX, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const attendanceData = [
  { name: 'الأحد', present: 28, absent: 3, late: 2 },
  { name: 'الإثنين', present: 25, absent: 5, late: 3 },
  { name: 'الثلاثاء', present: 30, absent: 2, late: 1 },
  { name: 'الأربعاء', present: 27, absent: 4, late: 2 },
  { name: 'الخميس', present: 29, absent: 3, late: 1 },
];

const calendarDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  status: Math.random() > 0.15 ? (Math.random() > 0.1 ? 'present' : 'late') : 'absent',
}));

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentAttendance() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  const stats = [
    { icon: CalendarCheck, label: language === 'ar' ? 'أيام الحضور' : 'Days Present', value: 85, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: CalendarX, label: language === 'ar' ? 'أيام الغياب' : 'Days Absent', value: 5, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
    { icon: Clock, label: language === 'ar' ? 'تأخر' : 'Late', value: 8, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { icon: TrendingUp, label: language === 'ar' ? 'معدل الحضور' : 'Rate', value: '91%', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'ar' ? 'تقويم الحضور - الشهر الحالي' : 'Attendance Calendar - Current Month'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1.5">
                {['أحد', 'إث', 'ثلا', 'أر', 'خم', 'جم', 'سب'].map((d, i) => (
                  <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                ))}
                {/* Empty cells for offset */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {calendarDays.map((d) => (
                  <motion.div
                    key={d.day}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-default transition-colors ${
                      d.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      d.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    {d.day}
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30" />{language === 'ar' ? 'حاضر' : 'Present'}</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30" />{language === 'ar' ? 'متأخر' : 'Late'}</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30" />{language === 'ar' ? 'غائب' : 'Absent'}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'ar' ? 'إحصائيات الحضور الأسبوعية' : 'Weekly Attendance Stats'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#10b981" name={language === 'ar' ? 'حاضر' : 'Present'} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" fill="#f59e0b" name={language === 'ar' ? 'متأخر' : 'Late'} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" name={language === 'ar' ? 'غائب' : 'Absent'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendance Table */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'ar' ? 'سجل الحضور التفصيلي' : 'Detailed Attendance Record'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الدورة' : 'Course'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2025-01-15', course: 'إتقان الإنجليزية', status: 'present' },
                    { date: '2025-01-15', course: 'أساسيات الرياضيات', status: 'present' },
                    { date: '2025-01-14', course: 'إتقان الإنجليزية', status: 'late' },
                    { date: '2025-01-13', course: 'أساسيات الرياضيات', status: 'absent' },
                    { date: '2025-01-12', course: 'إتقان الإنجليزية', status: 'present' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2.5 px-3">{row.date}</td>
                      <td className="py-2.5 px-3">{row.course}</td>
                      <td className="py-2.5 px-3">
                        <Badge className={`text-xs ${
                          row.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                          row.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {row.status === 'present' ? (language === 'ar' ? 'حاضر' : 'Present') :
                           row.status === 'late' ? (language === 'ar' ? 'متأخر' : 'Late') :
                           (language === 'ar' ? 'غائب' : 'Absent')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
