export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'admin_manager' | 'owner';
export type Language = 'ar' | 'en' | 'fr';
export type CourseStatus = 'active' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  language: Language;
  twoFactorEnabled: boolean;
}

export interface Course {
  id: string;
  title: string;
  titleAr?: string;
  titleFr?: string;
  description: string;
  descriptionAr?: string;
  descriptionFr?: string;
  category: string;
  level: string;
  price: number;
  currency: string;
  capacity: number;
  schedule: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  imageUrl?: string;
  teacherId: string;
  teacherName?: string;
  enrolledCount?: number;
  rating?: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  grade?: number;
  course?: Course;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  proofUrl?: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  level: number;
  category: string;
  badge?: string;
  earnedAt: string;
}

export interface GamificationData {
  id: string;
  userId: string;
  points: number;
  level: number;
  streak: number;
  badges: string[];
  rank: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface DashboardStats {
  [key: string]: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalRevenue: number;
  activeEnrollments: number;
  attendanceRate: number;
  monthlyGrowth: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export type AppView = 'landing' | 'login' | 'register' | 'dashboard' | 'courses' | 'course-detail' | 'profile' | 'settings';
export type DashboardTab = 'overview' | 'courses' | 'attendance' | 'skills' | 'payments' | 'notifications' | 'messages' | 'schedule' | 'ai-suggestions' | 'gamification' | 'users' | 'reports' | 'analytics' | 'settings';
