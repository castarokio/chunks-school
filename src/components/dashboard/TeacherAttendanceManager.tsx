'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import type { AttendanceStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  CalendarIcon, CheckCircle2, XCircle, Clock, UserCheck,
  CheckCheck, Send, Users, BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';

type StudentAttendance = {
  id: string;
  name: string;
  status: AttendanceStatus;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function TeacherAttendanceManager() {
  const { language, user, courses } = useAppStore();
  const rtl = isRTL(language);

  const teacherCourses = useMemo(() => {
    return courses.filter(c => c.teacherId === user?.id);
  }, [courses, user]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeCourseId = selectedCourse || teacherCourses[0]?.id || '';

  // Load roster
  useEffect(() => {
    if (!activeCourseId) return;

    const fetchRoster = async () => {
      setLoadingStudents(true);
      try {
        const res = await fetch(`/api/enrollments?courseId=${activeCourseId}&status=approved`);
        if (res.ok) {
          const data = await res.json();
          const roster = (data.enrollments || []).map((e: any) => ({
            id: e.studentId,
            name: e.student?.name || 'Student',
            status: 'present' as const
          }));
          setStudents(roster);
        } else {
          setStudents([]);
        }
      } catch (e) {
        console.error(e);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchRoster();
  }, [activeCourseId]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' as const })));
  };

  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;

  const handleSubmit = async () => {
    if (!activeCourseId) return;
    setSubmitting(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: activeCourseId,
          date: dateStr,
          records: students.map((s) => ({
            studentId: s.id,
            status: s.status,
            notes: ''
          }))
        })
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(
          language === 'ar'
            ? 'تم تسجيل الحضور بنجاح!'
            : 'Attendance submitted successfully!'
        );
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit attendance');
      }
    } catch {
      toast.error('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const statusButton = (
    studentId: string,
    currentStatus: AttendanceStatus,
    targetStatus: AttendanceStatus,
    Icon: typeof CheckCircle2,
    label: string,
    activeClass: string,
  ) => {
    const isActive = currentStatus === targetStatus;
    return (
      <button
        onClick={() => setStatus(studentId, targetStatus)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isActive ? activeClass : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </button>
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header & Controls */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Course Selector */}
              <div className="flex-1 min-w-0">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  {language === 'ar' ? 'اختر الدورة' : 'Select Course'}
                </label>
                <Select value={activeCourseId} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الدورة' : 'Select a course'} />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {language === 'ar' ? course.titleAr || course.title : course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div className="min-w-0">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {format(date, 'PPP', { locale: language === 'ar' ? ar : undefined })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align={rtl ? 'end' : 'start'}>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Mark All Present */}
              <div className="min-w-0">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block opacity-0">
                  {'_'}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllPresent}
                  className="w-full sm:w-auto text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                >
                  <UserCheck className="w-4 h-4 me-1.5" />
                  {language === 'ar' ? 'جميعهم حاضرون' : 'Mark All Present'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auto-scoring Visualization */}
      <motion.div variants={item}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'حاضر' : 'Present'}
              </p>
              <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${students.length > 0 ? (presentCount / students.length) * 100 : 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-500">{absentCount}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'غائب' : 'Absent'}
              </p>
              <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${students.length > 0 ? (absentCount / students.length) * 100 : 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-500">{lateCount}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'متأخر' : 'Late'}
              </p>
              <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${students.length > 0 ? (lateCount / students.length) * 100 : 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'قائمة الطلاب' : 'Student List'}
                <Badge variant="secondary" className="text-xs">{students.length}</Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {language === 'ar' ? 'جاري تحميل قائمة الطلاب...' : 'Loading student roster...'}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {students.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      {t('common.noData', language)}
                    </p>
                  )}
                  {students.map((student, i) => (
                    <motion.div
                      key={student.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl transition-colors ${
                        student.status === 'present'
                          ? 'bg-emerald-50/50 dark:bg-emerald-900/10'
                          : student.status === 'absent'
                          ? 'bg-red-50/50 dark:bg-red-900/10'
                          : student.status === 'late'
                          ? 'bg-amber-50/50 dark:bg-amber-900/10'
                          : 'bg-gray-50 dark:bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          student.status === 'present'
                            ? 'bg-emerald-500'
                            : student.status === 'absent'
                            ? 'bg-red-500'
                            : student.status === 'late'
                            ? 'bg-amber-500'
                            : 'bg-gray-400'
                        }`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.id.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ms-12 sm:ms-0">
                        {statusButton(
                          student.id, student.status, 'present',
                          CheckCircle2,
                          language === 'ar' ? 'حاضر' : 'Present',
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shadow-sm',
                        )}
                        {statusButton(
                          student.id, student.status, 'absent',
                          XCircle,
                          language === 'ar' ? 'غائب' : 'Absent',
                          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 shadow-sm',
                        )}
                        {statusButton(
                          student.id, student.status, 'late',
                          Clock,
                          language === 'ar' ? 'متأخر' : 'Late',
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 shadow-sm',
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={item} className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={submitting || submitted}
          className={`px-8 ${
            submitted
              ? 'bg-emerald-600 hover:bg-emerald-600'
              : 'bg-emerald-600 hover:bg-emerald-700'
          } text-white`}
        >
          {submitted ? (
            <>
              <CheckCheck className="w-5 h-5 me-2" />
              {language === 'ar' ? 'تم التسجيل!' : 'Submitted!'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 me-2" />
              {language === 'ar' ? 'تسجيل الحضور' : 'Submit Attendance'}
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
