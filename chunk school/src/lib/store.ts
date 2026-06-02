import { create } from 'zustand';
import type { AuthUser, Language, AppView, DashboardTab, Notification, GamificationData, Course, Enrollment, Skill } from './types';

interface AppState {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;

  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Theme
  isDark: boolean;
  toggleDark: () => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Courses
  courses: Course[];
  setCourses: (courses: Course[]) => void;

  // Enrollments
  enrollments: Enrollment[];
  setEnrollments: (enrollments: Enrollment[]) => void;

  // Skills
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;

  // Gamification
  gamification: GamificationData | null;
  setGamification: (data: GamificationData | null) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Chatbot
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;

  // Loading
  loading: boolean;
  setLoading: (l: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false, currentView: 'landing', dashboardTab: 'overview' }),

  // Navigation
  currentView: 'landing',
  setCurrentView: (currentView) => set({ currentView }),
  dashboardTab: 'overview',
  setDashboardTab: (dashboardTab) => set({ dashboardTab }),
  selectedCourseId: null,
  setSelectedCourseId: (selectedCourseId) => set({ selectedCourseId }),

  // Language
  language: 'ar',
  setLanguage: (language) => set({ language }),

  // Theme
  isDark: false,
  toggleDark: () => set((s) => ({ isDark: !s.isDark })),

  // Notifications
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Courses
  courses: [],
  setCourses: (courses) => set({ courses }),

  // Enrollments
  enrollments: [],
  setEnrollments: (enrollments) => set({ enrollments }),

  // Skills
  skills: [],
  setSkills: (skills) => set({ skills }),

  // Gamification
  gamification: null,
  setGamification: (gamification) => set({ gamification }),

  // Sound
  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  // Chatbot
  chatOpen: false,
  setChatOpen: (chatOpen) => set({ chatOpen }),

  // Loading
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
