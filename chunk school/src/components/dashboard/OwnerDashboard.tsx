'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import {
  mockDashboardStats,
  mockRevenueForecast,
  mockEnrollmentForecast,
  mockCriticalAlerts,
  mockAIRecommendations,
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign, TrendingUp, Users, Zap, Brain, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Crown, UsersRound, BarChart3,
  Lightbulb, Shield, Box, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function OwnerDashboard() {
  const { language, user } = useAppStore();
  const rtl = isRTL(language);

  const executiveKPIs = [
    {
      icon: DollarSign,
      label: language === 'ar' ? 'الإيرادات' : 'Revenue',
      value: `${(mockDashboardStats.totalRevenue / 1000000).toFixed(1)}M`,
      subvalue: 'DZD',
      color: 'from-emerald-400 to-emerald-600',
      trend: '+18%',
      up: true,
    },
    {
      icon: Users,
      label: language === 'ar' ? 'التسجيل' : 'Enrollment',
      value: mockDashboardStats.activeEnrollments,
      subvalue: language === 'ar' ? 'تسجيل نشط' : 'active',
      color: 'from-teal-400 to-teal-600',
      trend: '+12%',
      up: true,
    },
    {
      icon: Zap,
      label: language === 'ar' ? 'التفاعل' : 'Engagement',
      value: '87%',
      subvalue: language === 'ar' ? 'معدل التفاعل' : 'rate',
      color: 'from-amber-400 to-amber-600',
      trend: '+5%',
      up: true,
    },
    {
      icon: TrendingUp,
      label: language === 'ar' ? 'النمو' : 'Growth',
      value: `${mockDashboardStats.monthlyGrowth}%`,
      subvalue: language === 'ar' ? 'شهرياً' : 'monthly',
      color: 'from-orange-400 to-orange-500',
      trend: '+3%',
      up: true,
    },
  ];

  const severityConfig = {
    high: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800', icon: AlertTriangle },
    medium: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800', icon: AlertTriangle },
    low: { color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-800/50', border: 'border-gray-200 dark:border-gray-700', icon: AlertTriangle },
  };

  const categoryConfig: Record<string, { icon: typeof Lightbulb; color: string }> = {
    staffing: { icon: UsersRound, color: 'text-emerald-600' },
    allocation: { icon: BarChart3, color: 'text-amber-600' },
    pricing: { icon: DollarSign, color: 'text-teal-600' },
    expansion: { icon: Zap, color: 'text-orange-600' },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Owner Header with Full Access Badge */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-700 via-emerald-800 to-teal-900 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  {t('dashboard.welcome', language)} {user?.name || 'يوسف'} 👑
                  <Badge className="bg-amber-500 text-black text-xs gap-1">
                    <Crown className="w-3 h-3" />
                    {language === 'ar' ? 'وصول كامل' : 'Full Access'}
                  </Badge>
                </h2>
                <p className="text-emerald-100/80">
                  {language === 'ar'
                    ? 'لوحة تحكم المالك - جميع البيانات والتحليلات'
                    : 'Owner Dashboard - All data & analytics'}
                </p>
              </div>
              <Shield className="w-10 h-10 text-amber-400/50" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {executiveKPIs.map((kpi, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-lg`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label} • {kpi.subvalue}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast Chart */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'توقعات الإيرادات' : 'Revenue Forecast'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRevenueForecast}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#colorActual)" strokeWidth={2} name={language === 'ar' ? 'فعلي' : 'Actual'} />
                    <Area type="monotone" dataKey="forecast" stroke="#f59e0b" fill="url(#colorForecast)" strokeWidth={2} strokeDasharray="5 5" name={language === 'ar' ? 'متوقع' : 'Forecast'} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enrollment Trend Chart */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                {language === 'ar' ? 'اتجاه التسجيل' : 'Enrollment Trend'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockEnrollmentForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name={language === 'ar' ? 'فعلي' : 'Actual'} />
                    <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#f59e0b', r: 3 }} name={language === 'ar' ? 'متوقع' : 'Forecast'} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Predictive Analytics Section */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-600" />
              {language === 'ar' ? 'التحليلات التنبؤية (مدعوم بالذكاء الاصطناعي)' : 'Predictive Analytics (AI-Powered)'}
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 text-[10px]">AI</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-semibold">{language === 'ar' ? 'توقع التسجيل' : 'Enrollment Forecast'}</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600">+23%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar'
                    ? 'من المتوقع زيادة التسجيل بنسبة 23% في الفصل القادم بناءً على الاتجاهات الحالية'
                    : 'Enrollment expected to grow 23% next semester based on current trends'}
                </p>
                <Progress value={78} className="h-1.5 mt-3" />
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-semibold">{language === 'ar' ? 'توقع الإيرادات' : 'Revenue Forecast'}</p>
                </div>
                <p className="text-2xl font-bold text-amber-600">4.2M</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar'
                    ? 'من المتوقع أن تصل الإيرادات إلى 4.2 مليون د.ج بنهاية السنة المالية'
                    : 'Revenue projected to reach 4.2M DZD by fiscal year-end'}
                </p>
                <Progress value={65} className="h-1.5 mt-3" />
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-teal-500" />
                  <p className="text-sm font-semibold">{language === 'ar' ? 'معدل الاحتفاظ' : 'Retention Rate'}</p>
                </div>
                <p className="text-2xl font-bold text-teal-600">91%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar'
                    ? 'من المتوقع احتفاظ 91% من الطلاب الحاليين في الفصل القادم'
                    : '91% of current students expected to continue next semester'}
                </p>
                <Progress value={91} className="h-1.5 mt-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                {language === 'ar' ? 'تنبيهات حرجة' : 'Critical Alerts'}
                <Badge variant="destructive" className="text-[10px]">
                  {mockCriticalAlerts.filter((a) => a.severity === 'high').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                <AnimatePresence>
                  {mockCriticalAlerts.map((alert, i) => {
                    const config = severityConfig[alert.severity as keyof typeof severityConfig];
                    const AlertIcon = config.icon;
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`p-3 rounded-lg border ${config.bg} ${config.border}`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertIcon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{alert.title}</p>
                              <Badge className={`text-[9px] ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                                alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {alert.severity === 'high' ? (language === 'ar' ? 'عاجل' : 'Urgent') :
                                 alert.severity === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                                 (language === 'ar' ? 'منخفض' : 'Low')}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                {language === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {mockAIRecommendations.map((rec, i) => {
                  const catConfig = categoryConfig[rec.category] || categoryConfig.staffing;
                  const RecIcon = catConfig.icon;
                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-amber-100 dark:border-amber-800/30"
                    >
                      <div className="flex items-start gap-2">
                        <RecIcon className={`w-4 h-4 mt-0.5 shrink-0 ${catConfig.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{rec.title}</p>
                            <Badge className={`text-[9px] ${
                              rec.impact === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {rec.impact === 'high' ? (language === 'ar' ? 'تأثير عالي' : 'High Impact') : (language === 'ar' ? 'تأثير متوسط' : 'Medium')}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AR/VR Placeholder & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AR/VR Card */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{language === 'ar' ? 'واقع معزز / افتراضي' : 'AR / VR'}</p>
                  <p className="text-xs text-gray-400">{language === 'ar' ? 'قريباً' : 'Coming Soon'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                {language === 'ar'
                  ? 'تجربة تعليمية غامرة بتقنية الواقع المعزز والافتراضي. سيتم إطلاق هذه الميزة في الربع القادم.'
                  : 'Immersive educational experience with AR/VR technology. Launching next quarter.'}
              </p>
              <div className="mt-4">
                <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">
                  <Sparkles className="w-3 h-3 me-1" />
                  {language === 'ar' ? 'تحت التطوير' : 'In Development'}
                </Badge>
              </div>
              {/* Decorative 3D elements */}
              <div className="absolute top-2 end-2 w-20 h-20 border border-emerald-500/10 rounded-full" />
              <div className="absolute bottom-2 start-2 w-16 h-16 border border-amber-500/10 rounded-lg rotate-12" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Summary Stats */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                {language === 'ar' ? 'ملخص سريع' : 'Quick Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: language === 'ar' ? 'الطلاب النشطون' : 'Active Students', value: 342, color: 'text-emerald-600' },
                  { label: language === 'ar' ? 'المعلمون' : 'Teachers', value: 28, color: 'text-teal-600' },
                  { label: language === 'ar' ? 'الدورات النشطة' : 'Active Courses', value: 42, color: 'text-amber-600' },
                  { label: language === 'ar' ? 'معدل الحضور' : 'Attendance Rate', value: '91%', color: 'text-emerald-600' },
                  { label: language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue', value: '390K', color: 'text-teal-600' },
                  { label: language === 'ar' ? 'نمو الشهر' : 'Monthly Growth', value: '+12%', color: 'text-amber-600' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
