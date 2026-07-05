'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import type { NotificationType, Notification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell, BellOff, Check, CheckCheck, Info, Trophy, AlertTriangle,
  XCircle, CheckCircle2, Sparkles, Clock,
} from 'lucide-react';

type FilterTab = 'all' | 'info' | 'success' | 'achievement' | 'warning';

const typeConfig: Record<NotificationType, { icon: typeof Info; color: string; bg: string; border: string; darkBg: string; darkBorder: string }> = {
  info: {
    icon: Info,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    darkBg: 'dark:bg-gray-800/50',
    darkBorder: 'dark:border-gray-700',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    darkBg: 'dark:bg-emerald-900/15',
    darkBorder: 'dark:border-emerald-800',
  },
  achievement: {
    icon: Trophy,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    darkBg: 'dark:bg-amber-900/15',
    darkBorder: 'dark:border-amber-800',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    darkBg: 'dark:bg-orange-900/15',
    darkBorder: 'dark:border-orange-800',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    darkBg: 'dark:bg-red-900/15',
    darkBorder: 'dark:border-red-800',
  },
};

function formatTimeAgo(dateStr: string, lang: 'ar' | 'en' | 'fr'): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return lang === 'ar' ? 'الآن' : lang === 'fr' ? "À l'instant" : 'Just now';
  if (minutes < 60) return lang === 'ar' ? `منذ ${minutes} دقيقة` : lang === 'fr' ? `Il y a ${minutes} min` : `${minutes}m ago`;
  if (hours < 24) return lang === 'ar' ? `منذ ${hours} ساعة` : lang === 'fr' ? `Il y a ${hours}h` : `${hours}h ago`;
  return lang === 'ar' ? `منذ ${days} يوم` : lang === 'fr' ? `Il y a ${days}j` : `${days}d ago`;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function StudentNotifications() {
  const { language, notifications, addNotification, markNotificationRead } = useAppStore();
  const rtl = isRTL(language);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const allNotifications = notifications;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return allNotifications;
    return allNotifications.filter((n) => n.type === activeFilter);
  }, [allNotifications, activeFilter]);

  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    allNotifications.forEach((n) => {
      if (!n.isRead) markNotificationRead(n.id);
    });
  };

  const filterTabs: { key: FilterTab; label: string; labelEn: string; labelFr: string }[] = [
    { key: 'all', label: 'الكل', labelEn: 'All', labelFr: 'Tout' },
    { key: 'info', label: 'معلومات', labelEn: 'Info', labelFr: 'Info' },
    { key: 'success', label: 'نجاح', labelEn: 'Success', labelFr: 'Succès' },
    { key: 'achievement', label: 'إنجاز', labelEn: 'Achievement', labelFr: 'Réalisation' },
    { key: 'warning', label: 'تحذير', labelEn: 'Warning', labelFr: 'Avertissement' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            {t('dashboard.notifications', language)}
            {unreadCount > 0 && (
              <Badge className="bg-amber-500 text-black text-xs">{unreadCount}</Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'ar'
              ? `${unreadCount} إشعار غير مقروء من ${allNotifications.length}`
              : language === 'fr'
              ? `${unreadCount} non lus sur ${allNotifications.length}`
              : `${unreadCount} unread of ${allNotifications.length}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          >
            <CheckCheck className="w-4 h-4 me-1.5" />
            {language === 'ar' ? 'قراءة الكل' : language === 'fr' ? 'Tout lire' : 'Mark All Read'}
          </Button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={item}>
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeFilter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(tab.key)}
              className={
                activeFilter === tab.key
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
              }
            >
              {language === 'ar' ? tab.label : language === 'fr' ? tab.labelFr : tab.labelEn}
              {tab.key !== 'all' && (
                <Badge variant="secondary" className="ms-1.5 text-[10px] px-1.5 py-0">
                  {allNotifications.filter((n) => n.type === tab.key).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[600px]">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredNotifications.map((notification, i) => {
                      const config = typeConfig[notification.type];
                      const IconComp = config.icon;

                      return (
                        <motion.div
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, x: rtl ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: rtl ? -20 : 20 }}
                          transition={{ delay: i * 0.04, type: 'spring', bounce: 0.2 }}
                          className={`relative flex items-start gap-3 p-4 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/30 ${
                            !notification.isRead ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : ''
                          }`}
                        >
                          {/* Unread Indicator */}
                          {!notification.isRead && (
                            <div className="absolute top-4 start-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          )}

                          {/* Icon */}
                          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${config.bg} ${config.darkBg} ${config.border} ${config.darkBorder} border`}>
                            <IconComp className={`w-5 h-5 ${config.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(notification.createdAt, language)}
                                </span>
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 shrink-0"
                                    onClick={() => markNotificationRead(notification.id)}
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <BellOff className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('common.noData', language)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ar'
                        ? 'لا توجد إشعارات من هذا النوع'
                        : language === 'fr'
                        ? 'Aucune notification de ce type'
                        : 'No notifications of this type'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
