'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import type { DashboardTab, UserRole, Language, Notification } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  Bell,
  Calendar,
  Trophy,
  Brain,
  Settings,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';

interface MenuItem {
  id: DashboardTab;
  icon: React.ElementType;
  labelKey: string;
}

const studentMenu: MenuItem[] = [
  { id: 'overview', icon: LayoutDashboard, labelKey: 'dashboard.overview' },
  { id: 'courses', icon: BookOpen, labelKey: 'dashboard.courses' },
  { id: 'attendance', icon: CalendarCheck, labelKey: 'dashboard.attendance' },
  { id: 'skills', icon: Award, labelKey: 'dashboard.skills' },
  { id: 'payments', icon: CreditCard, labelKey: 'dashboard.payments' },
  { id: 'notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { id: 'schedule', icon: Calendar, labelKey: 'dashboard.schedule' },
  { id: 'gamification', icon: Trophy, labelKey: 'dashboard.gamification' },
  { id: 'ai-suggestions', icon: Brain, labelKey: 'dashboard.ai.suggestions' },
  { id: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
];

const teacherMenu: MenuItem[] = [
  { id: 'overview', icon: LayoutDashboard, labelKey: 'dashboard.overview' },
  { id: 'courses', icon: BookOpen, labelKey: 'dashboard.courses' },
  { id: 'attendance', icon: CalendarCheck, labelKey: 'dashboard.attendance' },
  { id: 'analytics', icon: BarChart3, labelKey: 'dashboard.analytics' },
  { id: 'notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { id: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
];

const parentMenu: MenuItem[] = [
  { id: 'overview', icon: LayoutDashboard, labelKey: 'dashboard.overview' },
  { id: 'courses', icon: Users, labelKey: 'dashboard.users' },
  { id: 'payments', icon: CreditCard, labelKey: 'dashboard.payments' },
  { id: 'notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { id: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
];

const adminMenu: MenuItem[] = [
  { id: 'overview', icon: LayoutDashboard, labelKey: 'dashboard.overview' },
  { id: 'users', icon: Users, labelKey: 'dashboard.users' },
  { id: 'courses', icon: BookOpen, labelKey: 'dashboard.courses' },
  { id: 'payments', icon: CreditCard, labelKey: 'dashboard.payments' },
  { id: 'notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { id: 'reports', icon: BarChart3, labelKey: 'dashboard.reports' },
  { id: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
];

const ownerMenu: MenuItem[] = [
  { id: 'overview', icon: LayoutDashboard, labelKey: 'dashboard.overview' },
  { id: 'analytics', icon: BarChart3, labelKey: 'dashboard.analytics' },
  { id: 'users', icon: Users, labelKey: 'dashboard.users' },
  { id: 'courses', icon: BookOpen, labelKey: 'dashboard.courses' },
  { id: 'payments', icon: CreditCard, labelKey: 'dashboard.payments' },
  { id: 'notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { id: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
];

const menuMap: Record<string, MenuItem[]> = {
  student: studentMenu,
  teacher: teacherMenu,
  parent: parentMenu,
  admin: adminMenu,
  admin_manager: adminMenu,
  owner: ownerMenu,
};

interface SidebarContentProps {
  collapsed?: boolean;
  language: Language;
  rtl: boolean;
  role: UserRole;
  user: { name?: string; email?: string } | null;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  setSidebarOpen: (open: boolean) => void;
  logout: () => void;
  menuItems: MenuItem[];
  unreadCount: number;
}

function SidebarContent({
  collapsed = false,
  language,
  rtl,
  role,
  user,
  dashboardTab,
  setDashboardTab,
  setSidebarOpen,
  logout,
  menuItems,
  unreadCount,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 p-4">
        <div className="relative w-10 h-10 shrink-0">
          <Image src="/champs-logo.png" alt="Champs School" fill className="object-contain" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-lg font-black text-accent" translate="no">
                Champs School
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((menuItem) => {
            const isActive = dashboardTab === menuItem.id;
            const Icon = menuItem.icon;
            return (
              <motion.button
                key={menuItem.id}
                onClick={() => {
                  setDashboardTab(menuItem.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`group relative flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition-[background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/15'
                    : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                whileHover={{ x: rtl ? -4 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-md bg-sidebar-primary/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`relative z-10 size-5 shrink-0 ${isActive ? 'text-sidebar-primary-foreground' : ''}`} aria-hidden="true" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {t(menuItem.labelKey, language)}
                    </motion.span>
                  )}
                </AnimatePresence>
                {menuItem.id === 'notifications' && unreadCount > 0 && (
                  <Badge className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center bg-accent text-xs text-accent-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* User info */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-2">
          <Avatar className="size-9 border border-sidebar-border">
            <AvatarFallback className="bg-accent text-sm font-black text-accent-foreground">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{user?.name || mockUsers.student.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{t(`auth.${role}`, language)}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="size-9 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Logout"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  const { language, user, dashboardTab, setDashboardTab, sidebarOpen, setSidebarOpen, logout, notifications } = useAppStore();
  const rtl = isRTL(language);
  const role: UserRole = user?.role || 'student';
  const menuItems = menuMap[role] || studentMenu;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const sidebarProps = {
    language,
    rtl,
    role,
    user,
    dashboardTab,
    setDashboardTab,
    setSidebarOpen,
    logout,
    menuItems,
    unreadCount,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="sticky top-0 z-30 hidden h-screen flex-col border-e border-sidebar-border lg:flex"
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <SidebarContent collapsed={!sidebarOpen} {...sidebarProps} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-1/2 z-40 size-8 -translate-y-1/2 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 ${rtl ? '-right-3' : '-left-3'}`}
          aria-label={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? (
            rtl ? <ChevronRight className="size-3" aria-hidden="true" /> : <ChevronLeft className="size-3" aria-hidden="true" />
          ) : (
            rtl ? <ChevronLeft className="size-3" aria-hidden="true" /> : <ChevronRight className="size-3" aria-hidden="true" />
          )}
        </Button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side={rtl ? 'right' : 'left'} className="w-80 border-none bg-transparent p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="h-full">
            <SidebarContent {...sidebarProps} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
