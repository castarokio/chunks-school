'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  Volume2,
  VolumeX,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const tabLabelMap: Record<string, string> = {
  overview: 'dashboard.overview',
  courses: 'dashboard.courses',
  attendance: 'dashboard.attendance',
  skills: 'dashboard.skills',
  payments: 'dashboard.payments',
  notifications: 'dashboard.notifications',
  messages: 'dashboard.messages',
  schedule: 'dashboard.schedule',
  gamification: 'dashboard.gamification',
  'ai-suggestions': 'dashboard.ai.suggestions',
  analytics: 'dashboard.analytics',
  settings: 'dashboard.settings',
  users: 'dashboard.users',
  reports: 'dashboard.reports',
};

export default function DashboardHeader() {
  const {
    language,
    setLanguage,
    isDark,
    toggleDark,
    soundEnabled,
    toggleSound,
    user,
    dashboardTab,
    notifications,
    markNotificationRead,
    logout,
    setSidebarOpen,
  } = useAppStore();

  const rtl = isRTL(language);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const languages: Array<{ code: 'ar' | 'en' | 'fr'; label: string }> = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 border-b border-border/70 bg-[#f4f1ee]/88 backdrop-blur-xl dark:bg-[#111]/88"
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        {/* Left: Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full hover:bg-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Dashboard Navigation"
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>

          <Breadcrumb className="hidden sm:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-black uppercase text-primary">
                  {t('nav.dashboard', language)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-[Impact,'Arial_Narrow',sans-serif] text-xl uppercase tracking-normal text-[#111] dark:text-[#f4f1ee]">
                  {t(tabLabelMap[dashboardTab] || 'dashboard.overview', language)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <span className="truncate font-[Impact,'Arial_Narrow',sans-serif] text-xl uppercase sm:hidden">
            {t(tabLabelMap[dashboardTab] || 'dashboard.overview', language)}
          </span>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className={`absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} aria-hidden="true" />
            <Input
              placeholder={t('common.search', language)}
              aria-label={t('common.search', language)}
              className={`${rtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-10 rounded-full border-border bg-white/85 font-bold shadow-[0_8px_24px_rgba(17,17,17,0.05)] dark:bg-[#1a1a1a]/85`}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Search on mobile */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white md:hidden" aria-label="Search">
            <Search className="size-4" aria-hidden="true" />
          </Button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white dark:hover:bg-[#242424]" aria-label="Change Language">
                <Globe className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={rtl ? 'start' : 'end'}>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? 'bg-primary/10' : ''}
                >
                  <span className={language === lang.code ? 'font-bold text-primary' : ''}>
                    {lang.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white dark:hover:bg-[#242424]" onClick={toggleDark} aria-label="Toggle Theme">
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <Sun className="size-4 text-primary" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
            </motion.div>
          </Button>

          {/* Sound Toggle */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white dark:hover:bg-[#242424]" onClick={toggleSound} aria-label="Toggle Sound">
            {soundEnabled ? (
              <Volume2 className="size-4" aria-hidden="true" />
            ) : (
              <VolumeX className="size-4 text-muted-foreground" aria-hidden="true" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white dark:hover:bg-[#242424]" aria-label="Open Notifications">
                <Bell className="size-4" aria-hidden="true" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={rtl ? 'start' : 'end'} className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t('dashboard.notifications', language)}</span>
                <Badge variant="secondary" className="text-xs">{unreadCount}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 5).map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`flex flex-col items-start gap-1 p-3 ${!n.isRead ? 'bg-primary/10' : ''}`}
                >
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('common.noData', language)}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2 rounded-full bg-white/70 px-2 hover:bg-white dark:bg-[#1a1a1a]/70 dark:hover:bg-[#242424]">
                <Avatar className="size-8 border border-border">
                  <AvatarFallback className="bg-primary text-xs font-black text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                  {user?.name || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={rtl ? 'start' : 'end'} className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="me-2 size-4" aria-hidden="true" />
                {t('common.view', language)} {t('dashboard.overview', language)}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="me-2 size-4" aria-hidden="true" />
                {t('dashboard.settings', language)}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                <LogOut className="me-2 size-4" aria-hidden="true" />
                {t('nav.logout', language)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
