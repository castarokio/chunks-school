'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CalendarX, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentAttendance() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/attendance', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (!controller.signal.aborted && data.logs) {
          setAttendanceLogs(data.logs);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) console.error(e);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Compute stats dynamically from API data only.
  const presentCount = attendanceLogs.filter(log => log.status === 'present').length;
  const absentCount = attendanceLogs.filter(log => log.status === 'absent').length;
  const lateCount = attendanceLogs.filter(log => log.status === 'late').length;

  const totalLogs = attendanceLogs.length;
  const attendanceRate = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 0;

  const stats = [
    { icon: CalendarCheck, label: language === 'ar' ? 'أيام الحضور' : 'Days Present', value: presentCount, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: CalendarX, label: language === 'ar' ? 'أيام الغياب' : 'Days Absent', value: absentCount, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
    { icon: Clock, label: language === 'ar' ? 'تأخر' : 'Late', value: lateCount, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { icon: TrendingUp, label: language === 'ar' ? 'معدل الحضور' : 'Rate', value: `${attendanceRate}%`, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
  ];

  const calendarDays = attendanceLogs.slice(0, 30).reverse().map((log) => ({
    day: new Date(log.date).getDate(),
    status: log.status
  }));

  const weekdayNames = language === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const attendanceData = weekdayNames.map((name) => ({ name, present: 0, absent: 0, late: 0 }));
  attendanceLogs.forEach((log) => {
    const day = new Date(log.date).getDay();
    if (log.status === 'present' || log.status === 'absent' || log.status === 'late') {
      attendanceData[day][log.status] += 1;
    }
  });

  // Map records table
  const activeRecords = attendanceLogs.map((log) => ({
    date: log.date,
    course: language === 'ar' ? log.courseTitleAr || log.courseTitle : log.courseTitle,
    status: log.status
  }));

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
              {loading ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  {language === 'ar' ? 'جاري تحميل سجل التقويم...' : 'Loading calendar record...'}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1.5" dir={rtl ? 'rtl' : 'ltr'}>
                  {['أحد', 'إث', 'ثلا', 'أر', 'خم', 'جم', 'سب'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                  ))}
                  {/* Empty cells for offset */}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {calendarDays.length === 0 && (
                    <div className="col-span-7 py-8 text-center text-sm text-muted-foreground">
                      {t('common.noData', language)}
                    </div>
                  )}
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
              )}
              <div className="flex items-center gap-4 mt-4 text-xs" dir={rtl ? 'rtl' : 'ltr'}>
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
              <table className="w-full text-sm" dir={rtl ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الدورة' : 'Course'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRecords.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 px-3 text-center text-muted-foreground">
                        {t('common.noData', language)}
                      </td>
                    </tr>
                  )}
                  {activeRecords.map((row, i) => (
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
