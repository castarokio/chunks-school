import { create } from 'zustand';
import type { AuthUser, Language, AppView, DashboardTab, Notification, GamificationData, Course, Enrollment, Skill, DashboardStats } from './types';

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

  // Stats
  stats: DashboardStats | null;
  setStats: (stats: DashboardStats | null) => void;

  // Hydration
  hydrateStore: (user: AuthUser) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    set({ user: null, isAuthenticated: false, currentView: 'landing', dashboardTab: 'overview' });
  },

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

  // Stats
  stats: null,
  setStats: (stats) => set({ stats }),

  // Hydrate store from real APIs
  hydrateStore: async (user) => {
    set({ loading: true });
    try {
      // 1. Fetch courses
      const coursesRes = await fetch('/api/courses');
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        if (coursesData.courses) set({ courses: coursesData.courses });
      }

      // 2. Fetch enrollments
      const enrollmentsRes = await fetch('/api/enrollments');
      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        if (enrollmentsData.enrollments) set({ enrollments: enrollmentsData.enrollments });
      }

      // 3. Fetch notifications
      const notificationsRes = await fetch('/api/notifications');
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        if (notificationsData.notifications) set({ notifications: notificationsData.notifications });
      }

      // 4. Fetch gamification details & skills
      const gamificationRes = await fetch('/api/gamification');
      if (gamificationRes.ok) {
        const gamificationData = await gamificationRes.json();
        if (gamificationData.gamification) set({ gamification: gamificationData.gamification });
        if (gamificationData.skills) set({ skills: gamificationData.skills });
      }

      // 5. Fetch dashboard stats
      const statsRes = await fetch('/api/dashboard/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) set({ stats: statsData.stats });
      }
    } catch (error) {
      console.error('Failed to hydrate store:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
