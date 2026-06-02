'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import {
  mockDashboardStats,
  mockRevenueData,
  mockEnrollmentTrend,
  mockCourses,
  mockAdminUsers,
  mockAdminPayments,
  mockLeaderboard,
  badgeInfo,
} from '@/lib/mock-data';
import type { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, BookOpen, DollarSign, TrendingUp, School, Search,
  Plus, Edit, Trash2, Eye, CheckCircle2, XCircle, Download,
  Bell, Send, Award, Settings, BarChart3, Shield,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

const roleBadgeClass: Record<string, string> = {
  student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  teacher: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  parent: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  owner: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export default function AdminDashboard() {
  const { language, user } = useAppStore();
  const rtl = isRTL(language);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', phone: '' });
  const [newCourse, setNewCourse] = useState({ title: '', titleAr: '', description: '', category: 'language', level: 'beginner', price: 15000, capacity: 25 });

  // Users tab
  const filteredUsers = useMemo(() => {
    return mockAdminUsers.filter((u) => {
      const matchSearch = u.name.includes(userSearch) || u.email.includes(userSearch);
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [userSearch, roleFilter]);

  // Payment stats
  const paymentStats = useMemo(() => ({
    total: mockAdminPayments.reduce((acc, p) => acc + p.amount, 0),
    pending: mockAdminPayments.filter((p) => p.status === 'pending').length,
    verified: mockAdminPayments.filter((p) => p.status === 'verified').length,
    rejected: mockAdminPayments.filter((p) => p.status === 'rejected').length,
  }), []);

  const enrollmentRate = Math.round((mockDashboardStats.activeEnrollments / (mockDashboardStats.totalStudents * 2)) * 100);

  const kpiCards = [
    { icon: Users, label: t('dashboard.totalStudents', language), value: mockDashboardStats.totalStudents, color: 'from-emerald-400 to-emerald-600', change: '+12%', up: true },
    { icon: School, label: t('dashboard.totalTeachers', language), value: mockDashboardStats.totalTeachers, color: 'from-teal-400 to-teal-600', change: '+3', up: true },
    { icon: BookOpen, label: t('dashboard.totalCourses', language), value: mockDashboardStats.totalCourses, color: 'from-amber-400 to-amber-600', change: '+5', up: true },
    { icon: DollarSign, label: t('dashboard.totalRevenue', language), value: `${(mockDashboardStats.totalRevenue / 1000000).toFixed(1)}M`, color: 'from-orange-400 to-orange-500', change: '+18%', up: true },
    { icon: TrendingUp, label: language === 'ar' ? 'معدل التسجيل' : 'Enrollment Rate', value: `${enrollmentRate}%`, color: 'from-rose-400 to-rose-600', change: '+5%', up: true },
    { icon: BarChart3, label: t('dashboard.attendanceRate', language), value: `${mockDashboardStats.attendanceRate}%`, color: 'from-violet-400 to-purple-600', change: '-2%', up: false },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="users" className="text-xs">{language === 'ar' ? 'المستخدمون' : 'Users'}</TabsTrigger>
          <TabsTrigger value="courses" className="text-xs">{language === 'ar' ? 'الدورات' : 'Courses'}</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">{language === 'ar' ? 'المدفوعات' : 'Payments'}</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">{language === 'ar' ? 'التقارير' : 'Reports'}</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</TabsTrigger>
          <TabsTrigger value="gamification" className="text-xs">{language === 'ar' ? 'الإنجازات' : 'Gamification'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 mt-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpiCards.map((kpi, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white mb-2 shadow`}>
                        <kpi.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xl font-bold">{kpi.value}</p>
                      <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                      <div className={`flex items-center gap-0.5 mt-1 text-[10px] ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                        {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {kpi.change}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={item}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      {language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      {language === 'ar' ? 'اتجاه التسجيل' : 'Enrollment Trends'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockEnrollmentTrend} barSize={20}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="new" fill="#10b981" radius={[4, 4, 0, 0]} name={language === 'ar' ? 'جديد' : 'New'} />
                          <Bar dataKey="returning" fill="#f59e0b" radius={[4, 4, 0, 0]} name={language === 'ar' ? 'عودة' : 'Returning'} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 mt-4">
            {/* Search & Filter */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('common.search', language)}
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className={rtl ? 'pr-10' : 'pl-10'}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={language === 'ar' ? 'الدور' : 'Role'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                  <SelectItem value="student">{language === 'ar' ? 'طالب' : 'Student'}</SelectItem>
                  <SelectItem value="teacher">{language === 'ar' ? 'معلم' : 'Teacher'}</SelectItem>
                  <SelectItem value="parent">{language === 'ar' ? 'ولي أمر' : 'Parent'}</SelectItem>
                  <SelectItem value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddUserOpen(true)}>
                <Plus className="w-4 h-4 me-1.5" />
                {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
              </Button>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                          <TableHead>{language === 'ar' ? 'البريد' : 'Email'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                          <TableHead>{language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</TableHead>
                          <TableHead className="text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u, i) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] ${roleBadgeClass[u.role] || ''}`}>
                                {language === 'ar'
                                  ? u.role === 'student' ? 'طالب' : u.role === 'teacher' ? 'معلم' : u.role === 'parent' ? 'ولي أمر' : u.role === 'admin' ? 'مدير' : 'مالك'
                                  : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.status === 'active' ? 'default' : 'secondary'} className={`text-[10px] ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-gray-100 text-gray-500'}`}>
                                {u.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{u.joinedAt}</TableCell>
                            <TableCell className="text-end">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="w-7 h-7"><Eye className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="w-7 h-7"><Edit className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 mt-4">
            <motion.div variants={item} className="flex justify-between items-center">
              <h3 className="text-base font-semibold">{language === 'ar' ? 'إدارة الدورات' : 'Course Management'}</h3>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddCourseOpen(true)}>
                <Plus className="w-4 h-4 me-1.5" />
                {language === 'ar' ? 'إضافة دورة' : 'Add Course'}
              </Button>
            </motion.div>
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'ar' ? 'الدورة' : 'Course'}</TableHead>
                          <TableHead>{language === 'ar' ? 'المعلم' : 'Teacher'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                          <TableHead>{language === 'ar' ? 'السعة' : 'Capacity'}</TableHead>
                          <TableHead>{language === 'ar' ? 'السعر' : 'Price'}</TableHead>
                          <TableHead className="text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{language === 'ar' ? course.titleAr || course.title : course.title}</p>
                                <p className="text-[10px] text-muted-foreground">{course.category}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{course.teacherName}</TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] ${course.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                {course.status === 'active' ? (language === 'ar' ? 'نشطة' : 'Active') : (language === 'ar' ? 'ملغاة' : 'Cancelled')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="min-w-[100px]">
                                <div className="flex justify-between text-[10px] mb-1">
                                  <span>{course.enrolledCount}/{course.capacity}</span>
                                  <span>{Math.round(((course.enrolledCount || 0) / course.capacity) * 100)}%</span>
                                </div>
                                <Progress value={((course.enrolledCount || 0) / course.capacity) * 100} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{course.price.toLocaleString()} {course.currency}</TableCell>
                            <TableCell className="text-end">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="w-7 h-7"><Edit className="w-3.5 h-3.5" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 mt-4">
            {/* Payment Stats */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي المدفوعات' : 'Total Payments'}</p>
                  <p className="text-lg font-bold">{paymentStats.total.toLocaleString()} DZD</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'معلّق' : 'Pending'}</p>
                  <p className="text-lg font-bold text-amber-600">{paymentStats.pending}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'موثّق' : 'Verified'}</p>
                  <p className="text-lg font-bold text-emerald-600">{paymentStats.verified}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'مرفوض' : 'Rejected'}</p>
                  <p className="text-lg font-bold text-red-500">{paymentStats.rejected}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'ar' ? 'الطالب' : 'Student'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الدورة' : 'Course'}</TableHead>
                          <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                          <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                          <TableHead className="text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAdminPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium text-sm">{payment.studentName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{payment.courseName}</TableCell>
                            <TableCell className="text-sm font-medium">{payment.amount.toLocaleString()} DZD</TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] ${
                                payment.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                                payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {payment.status === 'verified' ? (language === 'ar' ? 'موثّق' : 'Verified') :
                                 payment.status === 'pending' ? (language === 'ar' ? 'معلّق' : 'Pending') :
                                 (language === 'ar' ? 'مرفوض' : 'Rejected')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{payment.submittedAt}</TableCell>
                            <TableCell className="text-end">
                              {payment.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 h-7" onClick={() => toast.success(language === 'ar' ? 'تمت الموافقة على الدفع' : 'Payment approved!')}>
                                    <CheckCircle2 className="w-3 h-3 me-1" />
                                    {language === 'ar' ? 'موافقة' : 'Approve'}
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs px-2 h-7" onClick={() => toast.error(language === 'ar' ? 'تم رفض الدفع' : 'Payment rejected!')}>
                                    <XCircle className="w-3 h-3 me-1" />
                                    {language === 'ar' ? 'رفض' : 'Reject'}
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="ghost" size="sm" className="text-xs h-7">
                                  <Eye className="w-3 h-3 me-1" />
                                  {t('common.view', language)}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 mt-4">
            <motion.div variants={item}>
              <h3 className="text-base font-semibold mb-4">{language === 'ar' ? 'التقارير والتصدير' : 'Reports & Export'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: language === 'ar' ? 'تقرير الطلاب' : 'Students Report', icon: Users },
                  { label: language === 'ar' ? 'تقرير المالية' : 'Financial Report', icon: DollarSign },
                  { label: language === 'ar' ? 'تقرير الحضور' : 'Attendance Report', icon: BarChart3 },
                  { label: language === 'ar' ? 'تقرير الدورات' : 'Courses Report', icon: BookOpen },
                ].map((report, i) => (
                  <Button key={i} variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                    <report.icon className="w-6 h-6" />
                    <span className="text-xs">{report.label}</span>
                    <Download className="w-3 h-3 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Summary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={item}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{language === 'ar' ? 'توزيع الأدوار' : 'Role Distribution'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: language === 'ar' ? 'طلاب' : 'Students', value: 342, color: '#10b981' },
                              { name: language === 'ar' ? 'معلمون' : 'Teachers', value: 28, color: '#f59e0b' },
                              { name: language === 'ar' ? 'أولياء' : 'Parents', value: 180, color: '#14b8a6' },
                              { name: language === 'ar' ? 'إداريون' : 'Admins', value: 5, color: '#f97316' },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {[
                              { color: '#10b981' },
                              { color: '#f59e0b' },
                              { color: '#14b8a6' },
                              { color: '#f97316' },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockRevenueData.slice(0, 6)} barSize={24}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Notification */}
              <motion.div variants={item}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      {language === 'ar' ? 'إنشاء إشعار' : 'Create Notification'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder={language === 'ar' ? 'العنوان' : 'Title'} />
                    <Input placeholder={language === 'ar' ? 'الرسالة' : 'Message'} />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'نوع الإشعار' : 'Notification Type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">{language === 'ar' ? 'معلومات' : 'Info'}</SelectItem>
                        <SelectItem value="success">{language === 'ar' ? 'نجاح' : 'Success'}</SelectItem>
                        <SelectItem value="warning">{language === 'ar' ? 'تحذير' : 'Warning'}</SelectItem>
                        <SelectItem value="achievement">{language === 'ar' ? 'إنجاز' : 'Achievement'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked /> 📧 Email
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked /> 📱 Push
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="rounded" /> 🔊 Sound
                      </label>
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => toast.success(language === 'ar' ? 'تم إرسال الإشعار!' : 'Notification sent!')}
                    >
                      <Send className="w-4 h-4 me-1.5" />
                      {language === 'ar' ? 'إرسال الإشعار' : 'Send Notification'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notification History */}
              <motion.div variants={item}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-500" />
                      {language === 'ar' ? 'سجل الإشعارات' : 'Notification History'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {[
                        { title: 'تحديث النظام', channel: 'email+push', time: 'منذ ساعة', type: 'info' },
                        { title: 'بداية الفصل الجديد', channel: 'all', time: 'منذ يوم', type: 'success' },
                        { title: 'صيانة مجدولة', channel: 'push', time: 'منذ 3 أيام', type: 'warning' },
                        { title: 'مسابقة الأسبوع', channel: 'email+push', time: 'منذ أسبوع', type: 'achievement' },
                      ].map((n, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div>
                            <p className="text-sm font-medium">{n.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[9px]">
                                {n.channel === 'all' ? '📧📱🔊' : n.channel === 'push' ? '📱' : '📧📱'}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{n.time}</span>
                            </div>
                          </div>
                          <Badge className={`text-[9px] ${
                            n.type === 'info' ? 'bg-gray-100 text-gray-600' :
                            n.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                            n.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {n.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 mt-4">
            {/* Badge Management */}
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      {language === 'ar' ? 'إدارة الشارات' : 'Badge Management'}
                    </CardTitle>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Plus className="w-3.5 h-3.5 me-1" />
                      {language === 'ar' ? 'إضافة شارة' : 'Add Badge'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.entries(badgeInfo).map(([key, badge], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-3 rounded-xl bg-gradient-to-br ${badge.color} text-white text-center shadow-sm relative group cursor-pointer`}
                      >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <p className="text-[10px] font-medium leading-tight">{language === 'ar' ? badge.name : badge.nameEn}</p>
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="w-6 h-6 text-white"><Edit className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="w-6 h-6 text-white"><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard Configuration */}
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    {language === 'ar' ? 'إعدادات لوحة المتصدرين' : 'Leaderboard Configuration'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm">{language === 'ar' ? 'إظهار لوحة المتصدرين' : 'Show Leaderboard'}</span>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{language === 'ar' ? 'مفعّل' : 'Enabled'}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm">{language === 'ar' ? 'تحديث تلقائي' : 'Auto Refresh'}</span>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{language === 'ar' ? 'كل ساعة' : 'Hourly'}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm">{language === 'ar' ? 'عرض أفضل' : 'Display Top'}</span>
                      <Badge variant="secondary" className="text-[10px]">10</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-md" dir={rtl ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}</DialogTitle>
            <DialogDescription>{language === 'ar' ? 'أدخل بيانات المستخدم الجديد' : 'Enter the new user details'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
              <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'} />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@champs.dz" />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
              <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الدور' : 'Role'}</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{language === 'ar' ? 'طالب' : 'Student'}</SelectItem>
                  <SelectItem value="teacher">{language === 'ar' ? 'معلم' : 'Teacher'}</SelectItem>
                  <SelectItem value="parent">{language === 'ar' ? 'ولي أمر' : 'Parent'}</SelectItem>
                  <SelectItem value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} placeholder="+213 XXX XXX XXX" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>{t('common.cancel', language)}</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
              if (!newUser.name || !newUser.email || !newUser.password) {
                toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
                return;
              }
              toast.success(language === 'ar' ? 'تمت إضافة المستخدم بنجاح!' : 'User added successfully!');
              setAddUserOpen(false);
              setNewUser({ name: '', email: '', password: '', role: 'student', phone: '' });
            }}>{t('common.save', language)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
        <DialogContent className="sm:max-w-lg" dir={rtl ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'إضافة دورة جديدة' : 'Add New Course'}</DialogTitle>
            <DialogDescription>{language === 'ar' ? 'أدخل بيانات الدورة الجديدة' : 'Enter the new course details'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'عنوان الدورة' : 'Course Title'}</Label>
                <Input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="English Mastery" />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}</Label>
                <Input value={newCourse.titleAr} onChange={(e) => setNewCourse({ ...newCourse, titleAr: e.target.value })} placeholder="إتقان الإنجليزية" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف' : 'Description'}</Label>
              <Input value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} placeholder={language === 'ar' ? 'وصف الدورة' : 'Course description'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'التصنيف' : 'Category'}</Label>
                <Select value={newCourse.category} onValueChange={(v) => setNewCourse({ ...newCourse, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="language">{t('courses.category.language', language)}</SelectItem>
                    <SelectItem value="science">{t('courses.category.science', language)}</SelectItem>
                    <SelectItem value="math">{t('courses.category.math', language)}</SelectItem>
                    <SelectItem value="art">{t('courses.category.art', language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'المستوى' : 'Level'}</Label>
                <Select value={newCourse.level} onValueChange={(v) => setNewCourse({ ...newCourse, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{t('courses.beginner', language)}</SelectItem>
                    <SelectItem value="intermediate">{t('courses.intermediate', language)}</SelectItem>
                    <SelectItem value="advanced">{t('courses.advanced', language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'السعر (د.ج)' : 'Price (DZD)'}</Label>
                <Input type="number" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'السعة' : 'Capacity'}</Label>
                <Input type="number" value={newCourse.capacity} onChange={(e) => setNewCourse({ ...newCourse, capacity: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCourseOpen(false)}>{t('common.cancel', language)}</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
              if (!newCourse.title || !newCourse.description) {
                toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
                return;
              }
              toast.success(language === 'ar' ? 'تمت إضافة الدورة بنجاح!' : 'Course added successfully!');
              setAddCourseOpen(false);
              setNewCourse({ title: '', titleAr: '', description: '', category: 'language', level: 'beginner', price: 15000, capacity: 25 });
            }}>{t('common.save', language)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
