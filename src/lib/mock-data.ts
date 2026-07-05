import type { Course, Enrollment, Skill, GamificationData, Notification, AuthUser, DashboardStats } from './types';

export const mockUsers: Record<string, AuthUser> = {
  student: { id: 's1', email: 'student@champs.dz', name: 'أحمد محمد', role: 'student', language: 'ar', twoFactorEnabled: false, avatar: '' },
  teacher: { id: 't1', email: 'teacher@champs.dz', name: 'سارة علي', role: 'teacher', language: 'ar', twoFactorEnabled: true, avatar: '' },
  parent: { id: 'p1', email: 'parent@champs.dz', name: 'محمد كريم', role: 'parent', language: 'ar', twoFactorEnabled: false, avatar: '' },
  admin: { id: 'a1', email: 'admin@champs.dz', name: 'ليلى حسن', role: 'admin', language: 'ar', twoFactorEnabled: true, avatar: '' },
  owner: { id: 'o1', email: 'owner@champs.dz', name: 'يوسف مالك', role: 'owner', language: 'ar', twoFactorEnabled: true, avatar: '' },
};

export const mockCourses: Course[] = [
  { id: 'c1', title: 'English Mastery', titleAr: 'إتقان الإنجليزية', titleFr: 'Maîtrise de l\'Anglais', description: 'Comprehensive English course covering all levels', descriptionAr: 'دورة شاملة في اللغة الإنجليزية تغطي جميع المستويات', descriptionFr: 'Cours complet couvrant tous les niveaux', category: 'language', level: 'beginner', price: 15000, currency: 'DZD', capacity: 25, schedule: '{"days":["sun","tue","thu"],"time":"09:00-10:30"}', startDate: '2025-09-01', endDate: '2026-06-30', status: 'active', teacherId: 't1', teacherName: 'سارة علي', enrolledCount: 18, rating: 4.8 },
  { id: 'c2', title: 'French Intermediate', titleAr: 'الفرنسية المتوسطة', titleFr: 'Français Intermédiaire', description: 'Intermediate French for daily communication', descriptionAr: 'الفرنسية المتوسطة للتواصل اليومي', descriptionFr: 'Français intermédiaire pour la communication quotidienne', category: 'language', level: 'intermediate', price: 12000, currency: 'DZD', capacity: 20, schedule: '{"days":["mon","wed"],"time":"14:00-15:30"}', startDate: '2025-09-01', endDate: '2026-06-30', status: 'active', teacherId: 't1', teacherName: 'سارة علي', enrolledCount: 15, rating: 4.6 },
  { id: 'c3', title: 'Arabic Literature', titleAr: 'الأدب العربي', titleFr: 'Littérature Arabe', description: 'Deep dive into Arabic literature and poetry', descriptionAr: 'غوص عميق في الأدب والشعر العربي', descriptionFr: 'Plongée dans la littérature et la poésie arabes', category: 'language', level: 'advanced', price: 18000, currency: 'DZD', capacity: 15, schedule: '{"days":["tue","thu"],"time":"16:00-17:30"}', startDate: '2025-09-01', endDate: '2026-06-30', status: 'active', teacherId: 't1', teacherName: 'سارة علي', enrolledCount: 12, rating: 4.9 },
  { id: 'c4', title: 'Mathematics Fundamentals', titleAr: 'أساسيات الرياضيات', titleFr: 'Fondamentaux des Mathématiques', description: 'Core mathematics from algebra to calculus', descriptionAr: 'الرياضيات الأساسية من الجبر إلى التفاضل', descriptionFr: 'Mathématiques de base de l\'algèbre au calcul', category: 'math', level: 'beginner', price: 10000, currency: 'DZD', capacity: 30, schedule: '{"days":["sun","wed"],"time":"10:00-11:30"}', startDate: '2025-09-01', endDate: '2026-06-30', status: 'active', teacherId: 't1', teacherName: 'سارة علي', enrolledCount: 22, rating: 4.5 },
  { id: 'c5', title: 'Science Explorer', titleAr: 'مستكشف العلوم', titleFr: 'Explorateur des Sciences', description: 'Interactive science course covering physics, chemistry, and biology', descriptionAr: 'دورة علوم تفاعلية تغطي الفيزياء والكيمياء والأحياء', descriptionFr: 'Cours de sciences interactif couvrant la physique, la chimie et la biologie', category: 'science', level: 'intermediate', price: 14000, currency: 'DZD', capacity: 20, schedule: '{"days":["mon","thu"],"time":"11:00-12:30"}', startDate: '2025-09-01', endDate: '2026-06-30', status: 'active', teacherId: 't1', teacherName: 'سارة علي', enrolledCount: 16, rating: 4.7 },
  { id: 'c6', title: 'Digital Arts & Design', titleAr: 'الفنون الرقمية والتصميم', titleFr: 'Arts Numériques et Design', description: 'Creative digital arts with modern tools', descriptionAr: 'الفنون الرقمية الإبداعية بأدوات حديثة', descriptionFr: 'Arts numériques créatifs avec outils modernes', category: 'art', level: 'beginner', price: 16000, currency: 'DZD', capacity: 18, schedule: '{"days":["wed","sun"],"time":"15:00-16:30"}', startDate: '2025-09-01', endDate: '2026-06-30', status: 'active', teacherId: 't1', teacherName: 'سارة علي', enrolledCount: 14, rating: 4.4 },
];

export const mockEnrollments: Enrollment[] = [
  { id: 'e1', studentId: 's1', courseId: 'c1', status: 'approved', enrolledAt: '2025-09-01', progress: 65, grade: 85, course: mockCourses[0] },
  { id: 'e2', studentId: 's1', courseId: 'c4', status: 'approved', enrolledAt: '2025-09-01', progress: 40, grade: 78, course: mockCourses[3] },
  { id: 'e3', studentId: 's1', courseId: 'c5', status: 'pending', enrolledAt: '2025-10-15', progress: 0, course: mockCourses[4] },
];

export const mockSkills: Skill[] = [
  { id: 'sk1', userId: 's1', name: 'English Speaking', level: 6, category: 'language', badge: '🗣️', earnedAt: '2025-09-15' },
  { id: 'sk2', userId: 's1', name: 'English Writing', level: 5, category: 'language', badge: '✍️', earnedAt: '2025-10-01' },
  { id: 'sk3', userId: 's1', name: 'Mathematical Logic', level: 4, category: 'math', badge: '🧮', earnedAt: '2025-10-20' },
  { id: 'sk4', userId: 's1', name: 'Scientific Thinking', level: 3, category: 'science', badge: '🔬', earnedAt: '2025-11-01' },
  { id: 'sk5', userId: 's1', name: 'Teamwork', level: 7, category: 'soft', badge: '🤝', earnedAt: '2025-08-20' },
  { id: 'sk6', userId: 's1', name: 'Critical Thinking', level: 5, category: 'soft', badge: '🧠', earnedAt: '2025-09-10' },
];

export const mockGamification: GamificationData = {
  id: 'g1', userId: 's1', points: 2450, level: 12, streak: 7,
  badges: ['first_enrollment', 'week_streak', 'top_scorer', 'quick_learner', 'attendance_star', 'team_player'],
  rank: 3,
};

export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 's1', title: 'مرحباً بك!', message: 'تم تسجيلك بنجاح في منصة تشامبس سكول', type: 'success', isRead: false, createdAt: new Date().toISOString() },
  { id: 'n2', userId: 's1', title: 'شارة جديدة!', message: 'حصلت على شارة "حضور متميز" 🏆', type: 'achievement', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', userId: 's1', title: 'تذكير بالحضور', message: 'حصة الإنجليزية غداً الساعة 9:00', type: 'info', isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n4', userId: 's1', title: 'اقتراح ذكي', message: 'بناءً على تقدمك، ننصحك بدورة الفرنسية المتوسطة', type: 'info', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 342,
  totalTeachers: 28,
  totalCourses: 45,
  totalRevenue: 2850000,
  activeEnrollments: 267,
  attendanceRate: 91,
  monthlyGrowth: 12,
};

export const mockRevenueData = [
  { name: 'يناير', value: 280000 },
  { name: 'فبراير', value: 320000 },
  { name: 'مارس', value: 290000 },
  { name: 'أبريل', value: 350000 },
  { name: 'مايو', value: 380000 },
  { name: 'يونيو', value: 410000 },
  { name: 'يوليو', value: 300000 },
  { name: 'أغسطس', value: 260000 },
  { name: 'سبتمبر', value: 420000 },
  { name: 'أكتوبر', value: 390000 },
  { name: 'نوفمبر', value: 360000 },
  { name: 'ديسمبر', value: 340000 },
];

export const mockEnrollmentTrend = [
  { name: 'سبتمبر', new: 45, returning: 20 },
  { name: 'أكتوبر', new: 38, returning: 25 },
  { name: 'نوفمبر', new: 42, returning: 22 },
  { name: 'ديسمبر', new: 30, returning: 18 },
  { name: 'يناير', new: 55, returning: 30 },
  { name: 'فبراير', new: 48, returning: 28 },
];

export const mockAttendanceData = [
  { name: 'الأحد', present: 28, absent: 3, late: 2 },
  { name: 'الإثنين', present: 25, absent: 5, late: 3 },
  { name: 'الثلاثاء', present: 30, absent: 2, late: 1 },
  { name: 'الأربعاء', present: 27, absent: 4, late: 2 },
  { name: 'الخميس', present: 29, absent: 3, late: 1 },
];

export const mockLeaderboard = [
  { id: '1', name: 'أحمد محمد', points: 3200, level: 15, badge: '🥇' },
  { id: '2', name: 'فاطمة علي', points: 2980, level: 14, badge: '🥈' },
  { id: '3', name: 'أحمد محمد', points: 2450, level: 12, badge: '🥉' },
  { id: '4', name: 'يوسف خالد', points: 2100, level: 11, badge: '' },
  { id: '5', name: 'مريم سعيد', points: 1950, level: 10, badge: '' },
  { id: '6', name: 'عمر حسين', points: 1800, level: 9, badge: '' },
  { id: '7', name: 'نورة أحمد', points: 1650, level: 8, badge: '' },
  { id: '8', name: 'كريم بلال', points: 1500, level: 7, badge: '' },
  { id: '9', name: 'سلمى يوسف', points: 1350, level: 6, badge: '' },
  { id: '10', name: 'رامي عادل', points: 1200, level: 5, badge: '' },
];

export const badgeInfo: Record<string, { name: string; nameEn: string; icon: string; color: string }> = {
  first_enrollment: { name: 'التسجيل الأول', nameEn: 'First Enrollment', icon: '🎓', color: 'from-yellow-400 to-amber-500' },
  week_streak: { name: 'أسبوع متواصل', nameEn: 'Week Streak', icon: '🔥', color: 'from-orange-400 to-red-500' },
  top_scorer: { name: 'متصدّر', nameEn: 'Top Scorer', icon: '🏆', color: 'from-emerald-400 to-green-600' },
  quick_learner: { name: 'تعلم سريع', nameEn: 'Quick Learner', icon: '⚡', color: 'from-blue-400 to-cyan-500' },
  attendance_star: { name: 'نجم الحضور', nameEn: 'Attendance Star', icon: '⭐', color: 'from-purple-400 to-violet-600' },
  team_player: { name: 'روح الفريق', nameEn: 'Team Player', icon: '🤝', color: 'from-pink-400 to-rose-500' },
  math_wizard: { name: 'ساحر الرياضيات', nameEn: 'Math Wizard', icon: '🧙', color: 'from-indigo-400 to-blue-600' },
  language_master: { name: 'أستاذ اللغات', nameEn: 'Language Master', icon: '🌍', color: 'from-teal-400 to-emerald-500' },
  science_explorer: { name: 'مستكشف العلوم', nameEn: 'Science Explorer', icon: '🔬', color: 'from-green-400 to-lime-500' },
  creative_mind: { name: 'عقل مبدع', nameEn: 'Creative Mind', icon: '🎨', color: 'from-fuchsia-400 to-pink-500' },
};

export const mockTestimonials = [
  { id: '1', name: 'أحمد بلال', role: 'طالب لغة إنجليزية', content: 'منصة رائعة ساعدتني على تطوير مهاراتي اللغوية بشكل كبير. نظام النقاط والشارات يحفزني كل يوم!', rating: 5 },
  { id: '2', name: 'مريم سعيد', role: 'طالة لغة فرنسية', content: 'أفضل مدرسة تعليمية. المعلمون محترفون والمنصة سهلة الاستخدام ومليئة بالميزات المفيدة.', rating: 5 },
  { id: '3', name: 'كريم يوسف', role: 'ولي أمر', content: 'أستطيع متابعة تقدم ابني بشكل يومي. الإشعارات والتقارير مفيدة جداً لكل ولي أمر.', rating: 4 },
  { id: '4', name: 'سارة حسن', role: 'معلمة', content: 'المنصة تجعل إدارة الفصول ومتابعة الطلاب سهلة جداً. أدوات التحليلات ممتازة.', rating: 5 },
];

// Extended notifications for StudentNotifications component
export const mockExtendedNotifications: Notification[] = [
  { id: 'n1', userId: 's1', title: 'مرحباً بك!', message: 'تم تسجيلك بنجاح في منصة تشامبس سكول', type: 'success', isRead: false, createdAt: new Date().toISOString() },
  { id: 'n2', userId: 's1', title: 'شارة جديدة!', message: 'حصلت على شارة "حضور متميز" 🏆', type: 'achievement', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', userId: 's1', title: 'تذكير بالحضور', message: 'حصة الإنجليزية غداً الساعة 9:00', type: 'info', isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n4', userId: 's1', title: 'اقتراح ذكي', message: 'بناءً على تقدمك، ننصحك بدورة الفرنسية المتوسطة', type: 'info', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n5', userId: 's1', title: 'تنبيه حضور', message: 'تم تسجيل غيابك في حصة الأمس. يرجى التواصل مع المعلم', type: 'warning', isRead: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'n6', userId: 's1', title: 'إنجاز رائع!', message: 'حصلت على المركز الثالث في لوحة المتصدرين هذا الأسبوع 🌟', type: 'achievement', isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 'n7', userId: 's1', title: 'خطأ في النظام', message: 'حدث خطأ أثناء تحميل درجتك. يرجى المحاولة لاحقاً', type: 'error', isRead: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: 'n8', userId: 's1', title: 'تم تسجيل الدخول', message: 'تم تسجيل الدخول من جهاز جديد', type: 'info', isRead: true, createdAt: new Date(Date.now() - 432000000).toISOString() },
];

// Teacher-specific mock data
export const mockTeacherStudents = [
  { id: 's1', name: 'أحمد محمد', grade: 85, attendance: 92, course: 'English Mastery' },
  { id: 's2', name: 'فاطمة علي', grade: 92, attendance: 98, course: 'English Mastery' },
  { id: 's3', name: 'يوسف خالد', grade: 78, attendance: 85, course: 'Mathematics Fundamentals' },
  { id: 's4', name: 'مريم سعيد', grade: 88, attendance: 95, course: 'French Intermediate' },
  { id: 's5', name: 'عمر حسين', grade: 74, attendance: 80, course: 'Science Explorer' },
  { id: 's6', name: 'نورة أحمد', grade: 90, attendance: 96, course: 'Arabic Literature' },
  { id: 's7', name: 'كريم بلال', grade: 82, attendance: 88, course: 'Digital Arts & Design' },
  { id: 's8', name: 'سلمى يوسف', grade: 95, attendance: 99, course: 'English Mastery' },
];

export const mockTeacherCourseGrades = [
  { name: 'English', avgGrade: 85 },
  { name: 'French', avgGrade: 78 },
  { name: 'Arabic', avgGrade: 90 },
  { name: 'Math', avgGrade: 72 },
  { name: 'Science', avgGrade: 80 },
  { name: 'Arts', avgGrade: 88 },
];

export const mockTeacherCourseGradesAr = [
  { name: 'الإنجليزية', avgGrade: 85 },
  { name: 'الفرنسية', avgGrade: 78 },
  { name: 'العربية', avgGrade: 90 },
  { name: 'الرياضيات', avgGrade: 72 },
  { name: 'العلوم', avgGrade: 80 },
  { name: 'الفنون', avgGrade: 88 },
];

export const mockAttendanceAlerts = [
  { id: 'a1', studentName: 'عمر حسين', courseName: 'Science Explorer', absences: 5, lastAbsent: '2026-02-18' },
  { id: 'a2', studentName: 'يوسف خالد', courseName: 'Mathematics Fundamentals', absences: 4, lastAbsent: '2026-02-17' },
  { id: 'a3', studentName: 'كريم بلال', courseName: 'Digital Arts & Design', absences: 3, lastAbsent: '2026-02-16' },
];

// Attendance manager students
export const mockAttendanceStudents = [
  { id: 's1', name: 'أحمد محمد', status: 'present' as const },
  { id: 's2', name: 'فاطمة علي', status: 'present' as const },
  { id: 's3', name: 'يوسف خالد', status: 'absent' as const },
  { id: 's4', name: 'مريم سعيد', status: 'late' as const },
  { id: 's5', name: 'عمر حسين', status: 'present' as const },
  { id: 's6', name: 'نورة أحمد', status: 'present' as const },
  { id: 's7', name: 'كريم بلال', status: 'absent' as const },
  { id: 's8', name: 'سلمى يوسف', status: 'present' as const },
];

// Parent-specific mock data
export const mockLinkedStudents = [
  {
    id: 's1', name: 'أحمد محمد', enrolledCourses: 3, attendanceRate: 91, points: 2450, level: 12,
    grades: [
      { course: 'English Mastery', grade: 85 },
      { course: 'Math Fundamentals', grade: 78 },
      { course: 'Science Explorer', grade: 0 },
    ],
    achievements: [
      { id: 'a1', title: 'حضور متميز', icon: '⭐', date: '2026-02-10' },
      { id: 'a2', title: 'متصدّر الأسبوع', icon: '🏆', date: '2026-02-05' },
      { id: 'a3', title: 'تعلم سريع', icon: '⚡', date: '2026-01-28' },
    ],
  },
  {
    id: 's2', name: 'فاطمة محمد', enrolledCourses: 2, attendanceRate: 96, points: 3100, level: 14,
    grades: [
      { course: 'French Intermediate', grade: 92 },
      { course: 'Arabic Literature', grade: 88 },
    ],
    achievements: [
      { id: 'a4', title: 'أستاذ اللغات', icon: '🌍', date: '2026-02-12' },
      { id: 'a5', title: 'أسبوع متواصل', icon: '🔥', date: '2026-02-08' },
    ],
  },
];

export const mockParentPayments = [
  { id: 'p1', description: 'رسوم دورة الإنجليزية - فبراير', amount: 15000, dueDate: '2026-03-01', status: 'upcoming' as const },
  { id: 'p2', description: 'رسوم دورة الرياضيات - فبراير', amount: 10000, dueDate: '2026-03-05', status: 'upcoming' as const },
  { id: 'p3', description: 'رسوم دورة الفرنسية - يناير', amount: 12000, dueDate: '2026-02-01', status: 'paid' as const },
];

export const mockParentSuggestions = [
  { id: 'ps1', text: 'أحمد يحتاج دعماً إضافياً في الرياضيات. ننصح بجلوسه مع معلم خصوصي ساعة أسبوعياً', type: 'academic' },
  { id: 'ps2', text: 'فاطمة تظهر تفوقاً في اللغات. فكّر في تسجيلها في دورة المحادثة المتقدمة', type: 'enrichment' },
  { id: 'ps3', text: 'حضور أحمد تراجع هذا الأسبوع. تحدث معه عن أهمية الانتظام', type: 'attendance' },
];

export const mockApprovalQueue = [
  { id: 'aq1', studentName: 'أحمد محمد', activity: 'رحلة علمية إلى المتحف', date: '2026-03-10', status: 'pending' as const },
  { id: 'aq2', studentName: 'فاطمة محمد', activity: 'مسابقة الخطابة العربية', date: '2026-03-15', status: 'pending' as const },
  { id: 'aq3', studentName: 'أحمد محمد', activity: 'ورشة البرمجة الإبداعية', date: '2026-02-20', status: 'approved' as const },
];

// Admin mock data
export const mockAdminUsers = [
  { id: 'u1', name: 'أحمد محمد', email: 'ahmed@champs.dz', role: 'student' as const, status: 'active', joinedAt: '2025-09-01' },
  { id: 'u2', name: 'سارة علي', email: 'sara@champs.dz', role: 'teacher' as const, status: 'active', joinedAt: '2025-08-15' },
  { id: 'u3', name: 'محمد كريم', email: 'karim@champs.dz', role: 'parent' as const, status: 'active', joinedAt: '2025-09-10' },
  { id: 'u4', name: 'ليلى حسن', email: 'layla@champs.dz', role: 'admin' as const, status: 'active', joinedAt: '2025-07-01' },
  { id: 'u5', name: 'يوسف مالك', email: 'youssef@champs.dz', role: 'owner' as const, status: 'active', joinedAt: '2025-01-01' },
  { id: 'u6', name: 'فاطمة علي', email: 'fatima@champs.dz', role: 'student' as const, status: 'active', joinedAt: '2025-09-05' },
  { id: 'u7', name: 'خالد إبراهيم', email: 'khaled@champs.dz', role: 'teacher' as const, status: 'inactive', joinedAt: '2025-10-01' },
  { id: 'u8', name: 'مريم سعيد', email: 'maryam@champs.dz', role: 'student' as const, status: 'active', joinedAt: '2025-09-15' },
];

export const mockAdminPayments = [
  { id: 'ap1', studentName: 'أحمد محمد', courseName: 'English Mastery', amount: 15000, status: 'pending' as const, proofUrl: '', submittedAt: '2026-02-18' },
  { id: 'ap2', studentName: 'فاطمة علي', courseName: 'French Intermediate', amount: 12000, status: 'verified' as const, proofUrl: '', submittedAt: '2026-02-15' },
  { id: 'ap3', studentName: 'يوسف خالد', courseName: 'Math Fundamentals', amount: 10000, status: 'pending' as const, proofUrl: '', submittedAt: '2026-02-17' },
  { id: 'ap4', studentName: 'مريم سعيد', courseName: 'Arabic Literature', amount: 18000, status: 'rejected' as const, proofUrl: '', submittedAt: '2026-02-10' },
  { id: 'ap5', studentName: 'عمر حسين', courseName: 'Science Explorer', amount: 14000, status: 'verified' as const, proofUrl: '', submittedAt: '2026-02-12' },
];

export const mockRevenueForecast = [
  { name: 'يناير', actual: 280000 },
  { name: 'فبراير', actual: 320000 },
  { name: 'مارس', actual: 290000 },
  { name: 'أبريل', actual: 350000 },
  { name: 'مايو', actual: 380000 },
  { name: 'يونيو', actual: 410000 },
  { name: 'يوليو', actual: 300000, forecast: 300000 },
  { name: 'أغسطس', actual: 260000, forecast: 275000 },
  { name: 'سبتمبر', actual: 420000, forecast: 400000 },
  { name: 'أكتوبر', actual: 390000, forecast: 410000 },
  { name: 'نوفمبر', forecast: 430000 },
  { name: 'ديسمبر', forecast: 450000 },
];

export const mockEnrollmentForecast = [
  { name: 'سبتمبر', actual: 65 },
  { name: 'أكتوبر', actual: 63 },
  { name: 'نوفمبر', actual: 64 },
  { name: 'ديسمبر', actual: 48 },
  { name: 'يناير', actual: 85 },
  { name: 'فبراير', actual: 76 },
  { name: 'مارس', forecast: 80 },
  { name: 'أبريل', forecast: 82 },
  { name: 'مايو', forecast: 70 },
  { name: 'يونيو', forecast: 55 },
];

export const mockCriticalAlerts = [
  { id: 'ca1', title: 'انخفاض معدل الحضور', message: 'معدل حضور دورة العلوم انخفض إلى 72% - يتطلب تدخلاً فورياً', severity: 'high' as const, time: 'منذ ساعة' },
  { id: 'ca2', title: 'مدفوعات معلقة', message: '5 طلبات دفع بانتظار التحقق منذ أكثر من 48 ساعة', severity: 'medium' as const, time: 'منذ 3 ساعات' },
  { id: 'ca3', title: 'شكوى ولي أمر', message: 'شكوى بخصوص جودة حصة الرياضيات - تحتاج مراجعة', severity: 'high' as const, time: 'منذ 5 ساعات' },
  { id: 'ca4', title: 'نظام الصيانة', message: 'صيانة مجدولة يوم الجمعة من 2:00 إلى 4:00 صباحاً', severity: 'low' as const, time: 'أمس' },
];

export const mockAIRecommendations = [
  { id: 'r1', category: 'staffing', title: 'توظيف معلم رياضيات إضافي', description: 'بناءً على الطلب المتزايد، ننصح بتوظيف معلم رياضيات بدوام جزئي لتخفيف العبء عن المعلم الحالي', impact: 'high' as const },
  { id: 'r2', category: 'allocation', title: 'إعادة تخصيص دورة العلوم', description: 'نقترح نقل حصة العلوم من الثلاثاء إلى الأحد لزيادة نسبة الحضور المتوقعة بنسبة 15%', impact: 'medium' as const },
  { id: 'r3', category: 'pricing', title: 'تعديل رسوم دورة الفنون', description: 'تحليل السوق يشير إلى إمكانية رفع رسوم دورة الفنون الرقمية بنسبة 10% دون التأثير على التسجيل', impact: 'medium' as const },
  { id: 'r4', category: 'expansion', title: 'إطلاق دورات المساء', description: 'البيانات تظهر طلباً مرتفعاً على الدورات المسائية من فئة الموظفين. إطلاق 3 دورات مسائية قد يزيد الإيرادات بنسبة 20%', impact: 'high' as const },
];
