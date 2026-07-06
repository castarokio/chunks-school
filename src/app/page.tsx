'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { isRTL } from '@/lib/i18n';

// Landing
import ReferenceHomePage from '@/components/landing/ReferenceHomePage';

// Auth
import AuthPage from '@/components/auth/AuthPage';

// Dashboard
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StudentOverview from '@/components/dashboard/StudentOverview';
import StudentCourses from '@/components/dashboard/StudentCourses';
import StudentAttendance from '@/components/dashboard/StudentAttendance';
import StudentSkills from '@/components/dashboard/StudentSkills';
import StudentPayments from '@/components/dashboard/StudentPayments';
import StudentSchedule from '@/components/dashboard/StudentSchedule';
import StudentGamification from '@/components/dashboard/StudentGamification';
import StudentAISuggestions from '@/components/dashboard/StudentAISuggestions';
import StudentNotifications from '@/components/dashboard/StudentNotifications';
import TeacherOverview from '@/components/dashboard/TeacherOverview';
import TeacherAttendanceManager from '@/components/dashboard/TeacherAttendanceManager';
import ParentOverview from '@/components/dashboard/ParentOverview';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import DashboardSettings from '@/components/dashboard/DashboardSettings';

// Landing Page View
function LandingView() {
  return <ReferenceHomePage />;
}

// Dashboard Content Router
function DashboardContent() {
  const { user, dashboardTab } = useAppStore();
  const role = user?.role || 'student';

  // Student tabs
  if (role === 'student') {
    switch (dashboardTab) {
      case 'overview': return <StudentOverview />;
      case 'courses': return <StudentCourses />;
      case 'attendance': return <StudentAttendance />;
      case 'skills': return <StudentSkills />;
      case 'payments': return <StudentPayments />;
      case 'schedule': return <StudentSchedule />;
      case 'gamification': return <StudentGamification />;
      case 'ai-suggestions': return <StudentAISuggestions />;
      case 'notifications': return <StudentNotifications />;
      case 'settings': return <DashboardSettings />;
      default: return <StudentOverview />;
    }
  }

  // Teacher tabs
  if (role === 'teacher') {
    switch (dashboardTab) {
      case 'overview': return <TeacherOverview />;
      case 'attendance': return <TeacherAttendanceManager />;
      case 'courses': return <StudentCourses />;
      case 'analytics': return <TeacherOverview />;
      case 'notifications': return <StudentNotifications />;
      case 'settings': return <DashboardSettings />;
      default: return <TeacherOverview />;
    }
  }

  // Parent tabs
  if (role === 'parent') {
    switch (dashboardTab) {
      case 'overview': return <ParentOverview />;
      case 'courses': return <ParentOverview />;
      case 'payments': return <StudentPayments />;
      case 'notifications': return <StudentNotifications />;
      case 'settings': return <DashboardSettings />;
      default: return <ParentOverview />;
    }
  }

  // Admin & Admin Manager tabs - AdminDashboard handles its own tabs internally
  if (role === 'admin' || role === 'admin_manager') {
    return <AdminDashboard />;
  }

  // Owner tabs - OwnerDashboard handles its own tabs internally
  if (role === 'owner') {
    return <OwnerDashboard />;
  }

  return <StudentOverview />;
}

// Dashboard View
function DashboardView() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background" dir={rtl ? 'rtl' : 'ltr'}>
      <DashboardSidebar />
      <div className="brand-shell flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}

// Main App
export default function Home() {
  const { language, currentView, isDark, setUser, setCurrentView } = useAppStore();
  const rtl = isRTL(language);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setCurrentView('dashboard');

            // Hydrate store data from database APIs
            await useAppStore.getState().hydrateStore(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      }
    };
    restoreSession();
  }, [setUser, setCurrentView]);

  // Apply dark mode to html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      {currentView === 'landing' && <LandingView />}
      {(currentView === 'login' || currentView === 'register') && <AuthPage />}
      {currentView === 'dashboard' && <DashboardView />}
    </div>
  );
}
