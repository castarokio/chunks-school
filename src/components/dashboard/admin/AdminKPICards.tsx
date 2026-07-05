'use client';

import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users, School, BookOpen, DollarSign, TrendingUp, BarChart3,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

import type { DashboardStats, Language } from '@/lib/types';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

interface AdminKPICardsProps {
  language: Language;
  stats: DashboardStats | null;
}

export function AdminKPICards({ language, stats }: AdminKPICardsProps) {
  const enrollmentRate = stats && stats.totalStudents > 0
    ? Math.round((stats.activeEnrollments / stats.totalStudents) * 100)
    : 0;
  const totalRevenue = stats?.totalRevenue || 0;

  const kpiCards = [
    { icon: Users, label: t('dashboard.totalStudents', language), value: stats?.totalStudents || 0, color: 'from-emerald-400 to-emerald-600', change: `${stats?.newStudentsThisMonth || 0}`, up: true },
    { icon: School, label: t('dashboard.totalTeachers', language), value: stats?.totalTeachers || 0, color: 'from-teal-400 to-teal-600', change: '0', up: true },
    { icon: BookOpen, label: t('dashboard.totalCourses', language), value: stats?.totalCourses || 0, color: 'from-amber-400 to-amber-600', change: `${stats?.pendingEnrollments || 0}`, up: true },
    { icon: DollarSign, label: t('dashboard.totalRevenue', language), value: `${totalRevenue.toLocaleString()} DZD`, color: 'from-orange-400 to-orange-500', change: `${stats?.pendingPayments || 0}`, up: true },
    { icon: TrendingUp, label: language === 'ar' ? 'معدل التسجيل' : 'Enrollment Rate', value: `${enrollmentRate}%`, color: 'from-rose-400 to-rose-600', change: `${stats?.courseCompletionRate || 0}%`, up: true },
    { icon: BarChart3, label: t('dashboard.attendanceRate', language), value: `${stats?.attendanceRate || 0}%`, color: 'from-violet-400 to-purple-600', change: `${stats?.monthlyGrowth || 0}%`, up: (stats?.monthlyGrowth || 0) >= 0 },
  ];

  return (
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
  );
}
