'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import {
  badgeInfo,
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Users, BookOpen, DollarSign, TrendingUp,
  Plus, Edit, Trash2, Download,
  Bell, Send, Award, BarChart3, Shield,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { toast } from 'sonner';
import type { Course, UserRole } from '@/lib/types';

// Import modular components
import { AdminKPICards } from './admin/AdminKPICards';
import { UsersTab } from './admin/UsersTab';
import { PaymentsTab } from './admin/PaymentsTab';
import { AddUserDialog } from './admin/AddUserDialog';
import { AddCourseDialog } from './admin/AddCourseDialog';
import type { AdminPayment } from './admin/PaymentsTab';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  joinedAt: string;
}

type AdminCourse = Course;

interface AdminNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { language, stats } = useAppStore();
  const rtl = isRTL(language);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', phone: '' });
  const [newCourse, setNewCourse] = useState({ title: '', titleAr: '', description: '', category: 'language', level: 'beginner', price: 15000, capacity: 25, teacherId: '' });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    userId: 'all',
    title: '',
    message: '',
    type: 'info',
  });
  const [loadingAdminData, setLoadingAdminData] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingCourse, setSubmittingCourse] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);
  const [adminError, setAdminError] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoadingAdminData(true);
    setAdminError('');
    try {
      const [usersRes, coursesRes, paymentsRes, notificationsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/courses'),
        fetch('/api/payments'),
        fetch('/api/notifications?scope=all'),
      ]);

      if (!usersRes.ok || !coursesRes.ok || !paymentsRes.ok || !notificationsRes.ok) {
        throw new Error('Failed to load admin data');
      }

      const [usersData, coursesData, paymentsData, notificationsData] = await Promise.all([
        usersRes.json(),
        coursesRes.json(),
        paymentsRes.json(),
        notificationsRes.json(),
      ]);

      setUsers((usersData.users || []).map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.isActive ? 'active' : 'inactive',
        joinedAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
      })));
      setCourses(coursesData.courses || []);
      setPayments(paymentsData.payments || []);
      setNotifications(notificationsData.notifications || []);
    } catch (error) {
      console.error(error);
      setAdminError(language === 'ar' ? 'تعذر تحميل بيانات الإدارة' : 'Failed to load admin data');
    } finally {
      setLoadingAdminData(false);
    }
  }, [language]);

  useEffect(() => {
    void Promise.resolve().then(loadAdminData);
  }, [loadAdminData]);

  // Users tab filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearch, roleFilter]);

  // Payment stats calculations
  const paymentStats = useMemo(() => ({
    total: payments.reduce((acc, p) => acc + p.amount, 0),
    pending: payments.filter((p) => p.status === 'pending').length,
    verified: payments.filter((p) => p.status === 'verified').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
  }), [payments]);

  const teachers = useMemo(() => users
    .filter((user) => user.role === 'teacher')
    .map((user) => ({ id: user.id, name: user.name })), [users]);

  const revenueData = useMemo(() => {
    const buckets = new Map<string, number>();
    payments
      .filter((payment) => payment.status === 'verified')
      .forEach((payment) => {
        const key = payment.submittedAt?.slice(0, 7) || 'unknown';
        buckets.set(key, (buckets.get(key) || 0) + payment.amount);
      });
    return Array.from(buckets.entries()).map(([name, value]) => ({ name, value }));
  }, [payments]);

  const enrollmentTrend = useMemo(() => courses.map((course) => ({
    name: language === 'ar' ? course.titleAr || course.title : course.title,
    new: course.enrolledCount || 0,
    returning: 0,
  })), [courses, language]);

  const roleDistribution = useMemo(() => {
    const roles = [
      { role: 'student', name: language === 'ar' ? 'طلاب' : 'Students', color: '#10b981' },
      { role: 'teacher', name: language === 'ar' ? 'معلمون' : 'Teachers', color: '#f59e0b' },
      { role: 'parent', name: language === 'ar' ? 'أولياء' : 'Parents', color: '#14b8a6' },
      { role: 'admin', name: language === 'ar' ? 'إداريون' : 'Admins', color: '#f97316' },
    ];

    return roles.map((entry) => ({
      ...entry,
      value: users.filter((user) => entry.role === 'admin'
        ? ['admin', 'admin_manager', 'owner'].includes(user.role)
        : user.role === entry.role).length,
    }));
  }, [language, users]);

  const handleCreateUser = async () => {
    setSubmittingUser(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      toast.success(language === 'ar' ? 'تمت إضافة المستخدم بنجاح!' : 'User added successfully!');
      setAddUserOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'student', phone: '' });
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleCreateCourse = async () => {
    setSubmittingCourse(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourse,
          titleAr: newCourse.titleAr || null,
          currency: 'DZD',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create course');

      toast.success(language === 'ar' ? 'تمت إضافة الدورة بنجاح!' : 'Course added successfully!');
      setAddCourseOpen(false);
      setNewCourse({ title: '', titleAr: '', description: '', category: 'language', level: 'beginner', price: 15000, capacity: 25, teacherId: '' });
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
    } finally {
      setSubmittingCourse(false);
    }
  };

  const handleUpdatePayment = async (paymentId: string, status: 'verified' | 'rejected') => {
    setUpdatingPaymentId(paymentId);
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update payment');
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update payment');
      throw error;
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      toast.error(language === 'ar' ? 'العنوان والرسالة مطلوبان' : 'Title and message are required');
      return;
    }

    setSendingNotification(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send notification');

      setNotificationForm({ userId: 'all', title: '', message: '', type: 'info' });
      await loadAdminData();
      toast.success(language === 'ar' ? 'تم إرسال الإشعار!' : 'Notification sent!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send notification');
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {adminError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {adminError}
        </div>
      )}
      {loadingAdminData && (
        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {language === 'ar' ? 'جاري تحميل بيانات الإدارة...' : 'Loading admin data...'}
        </div>
      )}
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
            <AdminKPICards language={language} stats={stats} />

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
                        <LineChart data={revenueData}>
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
                        <BarChart data={enrollmentTrend} barSize={20}>
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
          <UsersTab
            language={language}
            rtl={rtl}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setAddUserOpen={setAddUserOpen}
            filteredUsers={filteredUsers}
          />
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
                        {courses.map((course) => (
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
          <PaymentsTab
            language={language}
            paymentStats={paymentStats}
            payments={payments}
            onUpdatePayment={handleUpdatePayment}
            updatingPaymentId={updatingPaymentId}
          />
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
                            data={roleDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {roleDistribution.map((entry, index) => (
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
                        <BarChart data={revenueData.slice(0, 6)} barSize={24}>
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
                    <Select
                      value={notificationForm.userId}
                      onValueChange={(value) => setNotificationForm((current) => ({ ...current, userId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'المستلم' : 'Recipient'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'كل المستخدمين' : 'All active users'}</SelectItem>
                        {users.map((adminUser) => (
                          <SelectItem key={adminUser.id} value={adminUser.id}>
                            {adminUser.name} ({adminUser.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={notificationForm.title}
                      onChange={(event) => setNotificationForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder={language === 'ar' ? 'العنوان' : 'Title'}
                    />
                    <Input
                      value={notificationForm.message}
                      onChange={(event) => setNotificationForm((current) => ({ ...current, message: event.target.value }))}
                      placeholder={language === 'ar' ? 'الرسالة' : 'Message'}
                    />
                    <Select
                      value={notificationForm.type}
                      onValueChange={(value) => setNotificationForm((current) => ({ ...current, type: value }))}
                    >
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
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'يتم إنشاء إشعار داخل التطبيق للمستلمين المحددين.' : 'Creates in-app notifications for the selected recipients.'}
                    </p>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleSendNotification}
                      disabled={sendingNotification}
                    >
                      <Send className="w-4 h-4 me-1.5" />
                      {sendingNotification
                        ? (language === 'ar' ? 'جارٍ الإرسال...' : 'Sending...')
                        : (language === 'ar' ? 'إرسال الإشعار' : 'Send Notification')}
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
                      {notifications.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'لا توجد إشعارات بعد.' : 'No notifications yet.'}
                        </p>
                      )}
                      {notifications.map((n) => (
                        <div key={n.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div>
                            <p className="text-sm font-medium">{n.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[9px]">
                                {n.user?.name || n.userId}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(n.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                              </span>
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
      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        language={language}
        rtl={rtl}
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleCreateUser}
        submitting={submittingUser}
      />

      {/* Add Course Dialog */}
      <AddCourseDialog
        open={addCourseOpen}
        onOpenChange={setAddCourseOpen}
        language={language}
        rtl={rtl}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        teachers={teachers}
        onSubmit={handleCreateCourse}
        submitting={submittingCourse}
      />
    </motion.div>
  );
}
