'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockEnrollments, mockCourses } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Clock, User, Star, Plus, Filter, ChevronRight,
} from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentCourses() {
  const { language, enrollments, setDashboardTab } = useAppStore();
  const rtl = isRTL(language);

  const activeEnrollments = (enrollments.length > 0 ? enrollments : mockEnrollments).filter(e => e.status === 'approved');
  const pendingEnrollments = (enrollments.length > 0 ? enrollments : mockEnrollments).filter(e => e.status === 'pending');
  const availableCourses = mockCourses.filter(c => !(enrollments.length > 0 ? enrollments : mockEnrollments).some(e => e.courseId === c.id));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="enrolled">
              {language === 'ar' ? 'مسجّل' : 'Enrolled'} ({activeEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              {language === 'ar' ? 'معلّق' : 'Pending'} ({pendingEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              {language === 'ar' ? 'متاح' : 'Available'} ({availableCourses.length})
            </TabsTrigger>
          </TabsList>

          {/* Enrolled Courses */}
          <TabsContent value="enrolled" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEnrollments.map((en) => {
                const course = en.course || mockCourses.find(c => c.id === en.courseId);
                if (!course) return null;
                return (
                  <motion.div key={en.id} variants={item}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white/30" />
                        </div>
                        <div className="absolute top-3 start-3">
                          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                            {course.level === 'beginner' ? t('courses.beginner', language) :
                             course.level === 'intermediate' ? t('courses.intermediate', language) :
                             t('courses.advanced', language)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 start-3 end-3">
                          <h3 className="text-white font-bold text-lg drop-shadow-md">
                            {language === 'ar' ? course.titleAr || course.title : course.title}
                          </h3>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{course.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                            <span className="font-medium">{en.progress}%</span>
                          </div>
                          <Progress value={en.progress} className="h-2" />
                        </div>
                        {en.grade && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{language === 'ar' ? 'الدرجة' : 'Grade'}</span>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                              {en.grade}%
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Pending Courses */}
          <TabsContent value="pending" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingEnrollments.map((en) => {
                const course = en.course || mockCourses.find(c => c.id === en.courseId);
                if (!course) return null;
                return (
                  <motion.div key={en.id} variants={item}>
                    <Card className="border-amber-200 dark:border-amber-800/30 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {language === 'ar' ? course.titleAr || course.title : course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'في انتظار الموافقة' : 'Awaiting approval'}
                            </p>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            {t('courses.enroll', language)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              {pendingEnrollments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t('common.noData', language)}</p>
              )}
            </div>
          </TabsContent>

          {/* Available Courses */}
          <TabsContent value="available" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCourses.map((course) => (
                <motion.div key={course.id} variants={item}>
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all group">
                    <div className="h-24 bg-gradient-to-br from-teal-400 to-emerald-600 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-white/20" />
                      </div>
                      <div className="absolute top-2 start-2">
                        <Badge className="bg-white/20 text-white text-xs backdrop-blur-sm">
                          {t(`courses.category.${course.category}`, language)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm">
                        {language === 'ar' ? course.titleAr || course.title : course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {language === 'ar' ? course.descriptionAr || course.description : course.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-bold text-emerald-600">
                          {course.price.toLocaleString()} {course.currency}
                        </span>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Plus className="w-3 h-3 me-1" />
                          {t('courses.enroll', language)}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
