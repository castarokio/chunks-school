'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users, BookOpen, CalendarCheck, ClipboardCheck,
  TrendingUp, AlertTriangle, Upload, MessageSquare,
  ArrowUpRight, Flame, Star,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function TeacherOverview() {
  const { language, user, setDashboardTab, stats, courses } = useAppStore();
  const rtl = isRTL(language);

  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);
  const gradesData = teacherCourses.map((course) => ({
    name: language === 'ar' ? course.titleAr || course.title : course.title,
    avgGrade: 0,
  }));
  const topStudents: {
    id: string;
    name: string;
    course: string;
    grade: number;
    attendance: number;
  }[] = [];
  const attendanceAlerts: {
    id: string;
    studentName: string;
    courseName: string;
    absences: number;
    lastAbsent: string;
  }[] = [];

  const totalStudents = teacherCourses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const avgAttendance = stats?.attendanceRate || 0;
  const pendingReviews = stats?.pendingEnrollments || 0;

  const statsList = [
    { icon: Users, label: language === 'ar' ? 'إجمالي الطلاب' : 'Total Students', value: stats?.totalStudents ?? totalStudents, color: 'from-emerald-400 to-emerald-600', change: '+5' },
    { icon: BookOpen, label: language === 'ar' ? 'الدورات' : 'Courses Teaching', value: stats?.myCourses ?? teacherCourses.length, color: 'from-teal-400 to-teal-600', change: '6' },
    { icon: CalendarCheck, label: language === 'ar' ? 'معدل الحضور' : 'Avg Attendance', value: `${avgAttendance}%`, color: 'from-amber-400 to-amber-600', change: '+2%' },
    { icon: ClipboardCheck, label: language === 'ar' ? 'مراجعات معلقة' : 'Pending Reviews', value: pendingReviews, color: 'from-orange-400 to-orange-500', change: '-3' },
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
                  {t('dashboard.welcome', language)} {user?.name || 'سارة'} 👩‍🏫
                </h2>
                <p className="text-emerald-100/80 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {language === 'ar' ? 'لديك 0 حصص اليوم' : 'You have 0 classes today'}
                  <span className="mx-2">•</span>
                  {language === 'ar' ? `${pendingReviews} مراجعة معلقة` : `${pendingReviews} pending reviews`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => setDashboardTab('attendance')}
                >
                  <CalendarCheck className="w-4 h-4 me-1.5" />
                  {language === 'ar' ? 'تسجيل الحضور' : 'Mark Attendance'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                  onClick={() => setDashboardTab('courses')}
                >
                  <BookOpen className="w-4 h-4 me-1.5" />
                  {t('dashboard.courses', language)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat, i) => (
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
        {/* Course Performance Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'أداء الدورات' : 'Course Performance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradesData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey="avgGrade" radius={[8, 8, 0, 0]}>
                      {gradesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.avgGrade >= 85 ? '#10b981' : entry.avgGrade >= 75 ? '#f59e0b' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Alerts */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                {language === 'ar' ? 'تنبيهات الحضور' : 'Attendance Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {attendanceAlerts.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {t('common.noData', language)}
                  </p>
                )}
                {attendanceAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{alert.studentName}</p>
                        <p className="text-xs text-muted-foreground">{alert.courseName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            {alert.absences} {language === 'ar' ? 'غياب' : 'absences'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{alert.lastAbsent}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-start hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                  onClick={() => setDashboardTab('attendance')}
                >
                  <CalendarCheck className="w-4 h-4 me-2 shrink-0" />
                  {language === 'ar' ? 'تسجيل الحضور' : 'Mark Attendance'}
                  <ArrowUpRight className="w-3 h-3 ms-auto shrink-0" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-start hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                  onClick={() => setDashboardTab('courses')}
                >
                  <Upload className="w-4 h-4 me-2 shrink-0" />
                  {language === 'ar' ? 'رفع محتوى' : 'Upload Content'}
                  <ArrowUpRight className="w-3 h-3 ms-auto shrink-0" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-start hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                  onClick={() => setDashboardTab('messages')}
                >
                  <MessageSquare className="w-4 h-4 me-2 shrink-0" />
                  {language === 'ar' ? 'مراسلة الطلاب' : 'Message Students'}
                  <ArrowUpRight className="w-3 h-3 ms-auto shrink-0" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Performance Summary */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  {language === 'ar' ? 'أفضل 5 طلاب' : 'Top 5 Students'}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  {t('common.view', language)} <ArrowUpRight className="w-3 h-3 ms-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="pb-2 text-start text-xs font-medium text-muted-foreground">#</th>
                      <th className="pb-2 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'الطالب' : 'Student'}
                      </th>
                      <th className="pb-2 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'الدورة' : 'Course'}
                      </th>
                      <th className="pb-2 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'الدرجة' : 'Grade'}
                      </th>
                      <th className="pb-2 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'الحضور' : 'Attendance'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                          {t('common.noData', language)}
                        </td>
                      </tr>
                    )}
                    {topStudents.map((student, i) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-gray-50 dark:border-gray-800/50"
                      >
                        <td className="py-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-gray-100 text-gray-600' :
                            i === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-500'
                          }`}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="py-3 font-medium">{student.name}</td>
                        <td className="py-3 text-muted-foreground text-xs">{student.course}</td>
                        <td className="py-3">
                          <Badge
                            variant="secondary"
                            className={student.grade >= 85 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30'}
                          >
                            {student.grade}%
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={student.attendance} className="h-1.5 w-16" />
                            <span className="text-xs text-muted-foreground">{student.attendance}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
