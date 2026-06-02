import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.leaderboard.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.fileUpload.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.gamification.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Users
  const owner = await prisma.user.create({
    data: { id: 'o1', email: 'owner@champs.dz', password: passwordHash, name: 'يوسف مالك', role: 'owner', language: 'ar', twoFactorEnabled: true, isActive: true },
  });
  const admin = await prisma.user.create({
    data: { id: 'a1', email: 'admin@champs.dz', password: passwordHash, name: 'ليلى حسن', role: 'admin', language: 'ar', twoFactorEnabled: true, isActive: true },
  });
  const teacher = await prisma.user.create({
    data: { id: 't1', email: 'teacher@champs.dz', password: passwordHash, name: 'سارة علي', role: 'teacher', language: 'ar', twoFactorEnabled: true, isActive: true },
  });
  const teacher2 = await prisma.user.create({
    data: { id: 't2', email: 'teacher2@champs.dz', password: passwordHash, name: 'خالد إبراهيم', role: 'teacher', language: 'ar', twoFactorEnabled: false, isActive: false },
  });
  const parent = await prisma.user.create({
    data: { id: 'p1', email: 'parent@champs.dz', password: passwordHash, name: 'محمد كريم', role: 'parent', language: 'ar', twoFactorEnabled: false, isActive: true },
  });
  const student = await prisma.user.create({
    data: { id: 's1', email: 'student@champs.dz', password: passwordHash, name: 'أحمد محمد', role: 'student', language: 'ar', twoFactorEnabled: false, parentId: 'p1', isActive: true },
  });
  const student2 = await prisma.user.create({
    data: { id: 's2', email: 'fatima@champs.dz', password: passwordHash, name: 'فاطمة علي', role: 'student', language: 'ar', twoFactorEnabled: false, parentId: 'p1', isActive: true },
  });
  const student3 = await prisma.user.create({
    data: { id: 's3', email: 'youssef@champs.dz', password: passwordHash, name: 'يوسف خالد', role: 'student', language: 'ar', twoFactorEnabled: false, isActive: true },
  });
  const student4 = await prisma.user.create({
    data: { id: 's4', email: 'maryam@champs.dz', password: passwordHash, name: 'مريم سعيد', role: 'student', language: 'ar', twoFactorEnabled: false, isActive: true },
  });
  const student5 = await prisma.user.create({
    data: { id: 's5', email: 'omar@champs.dz', password: passwordHash, name: 'عمر حسين', role: 'student', language: 'ar', twoFactorEnabled: false, isActive: true },
  });
  const student6 = await prisma.user.create({
    data: { id: 's6', email: 'noura@champs.dz', password: passwordHash, name: 'نورة أحمد', role: 'student', language: 'ar', twoFactorEnabled: false, isActive: true },
  });
  const student7 = await prisma.user.create({
    data: { id: 's7', email: 'karim@champs.dz', password: passwordHash, name: 'كريم بلال', role: 'student', language: 'ar', twoFactorEnabled: false, isActive: true },
  });
  const student8 = await prisma.user.create({
    data: { id: 's8', email: 'salma@champs.dz', password: passwordHash, name: 'سلمى يوسف', role: 'student', language: 'ar', twoFactorEnabled: false, isActive: true },
  });

  console.log('Users created');

  // Create Courses
  const courses = await Promise.all([
    prisma.course.create({
      data: { id: 'c1', title: 'English Mastery', titleAr: 'إتقان الإنجليزية', titleFr: "Maîtrise de l'Anglais", description: 'Comprehensive English course covering all levels', descriptionAr: 'دورة شاملة في اللغة الإنجليزية تغطي جميع المستويات', descriptionFr: 'Cours complet couvrant tous les niveaux', category: 'language', level: 'beginner', price: 15000, currency: 'DZD', capacity: 25, schedule: '{"days":["sun","tue","thu"],"time":"09:00-10:30"}', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), status: 'active', teacherId: 't1' },
    }),
    prisma.course.create({
      data: { id: 'c2', title: 'French Intermediate', titleAr: 'الفرنسية المتوسطة', titleFr: 'Français Intermédiaire', description: 'Intermediate French for daily communication', descriptionAr: 'الفرنسية المتوسطة للتواصل اليومي', descriptionFr: 'Français intermédiaire pour la communication quotidienne', category: 'language', level: 'intermediate', price: 12000, currency: 'DZD', capacity: 20, schedule: '{"days":["mon","wed"],"time":"14:00-15:30"}', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), status: 'active', teacherId: 't1' },
    }),
    prisma.course.create({
      data: { id: 'c3', title: 'Arabic Literature', titleAr: 'الأدب العربي', titleFr: 'Littérature Arabe', description: 'Deep dive into Arabic literature and poetry', descriptionAr: 'غوص عميق في الأدب والشعر العربي', descriptionFr: 'Plongée dans la littérature et la poésie arabes', category: 'language', level: 'advanced', price: 18000, currency: 'DZD', capacity: 15, schedule: '{"days":["tue","thu"],"time":"16:00-17:30"}', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), status: 'active', teacherId: 't1' },
    }),
    prisma.course.create({
      data: { id: 'c4', title: 'Mathematics Fundamentals', titleAr: 'أساسيات الرياضيات', titleFr: 'Fondamentaux des Mathématiques', description: 'Core mathematics from algebra to calculus', descriptionAr: 'الرياضيات الأساسية من الجبر إلى التفاضل', descriptionFr: "Mathématiques de base de l'algèbre au calcul", category: 'math', level: 'beginner', price: 10000, currency: 'DZD', capacity: 30, schedule: '{"days":["sun","wed"],"time":"10:00-11:30"}', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), status: 'active', teacherId: 't1' },
    }),
    prisma.course.create({
      data: { id: 'c5', title: 'Science Explorer', titleAr: 'مستكشف العلوم', titleFr: 'Explorateur des Sciences', description: 'Interactive science course covering physics, chemistry, and biology', descriptionAr: 'دورة علوم تفاعلية تغطي الفيزياء والكيمياء والأحياء', descriptionFr: 'Cours de sciences interactif couvrant la physique, la chimie et la biologie', category: 'science', level: 'intermediate', price: 14000, currency: 'DZD', capacity: 20, schedule: '{"days":["mon","thu"],"time":"11:00-12:30"}', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), status: 'active', teacherId: 't1' },
    }),
    prisma.course.create({
      data: { id: 'c6', title: 'Digital Arts & Design', titleAr: 'الفنون الرقمية والتصميم', titleFr: 'Arts Numériques et Design', description: 'Creative digital arts with modern tools', descriptionAr: 'الفنون الرقمية الإبداعية بأدوات حديثة', descriptionFr: 'Arts numériques créatifs avec outils modernes', category: 'art', level: 'beginner', price: 16000, currency: 'DZD', capacity: 18, schedule: '{"days":["wed","sun"],"time":"15:00-16:30"}', startDate: new Date('2025-09-01'), endDate: new Date('2026-06-30'), status: 'active', teacherId: 't1' },
    }),
  ]);
  console.log('Courses created');

  // Create Enrollments
  await Promise.all([
    prisma.enrollment.create({ data: { id: 'e1', studentId: 's1', courseId: 'c1', status: 'approved', progress: 65, grade: 85 } }),
    prisma.enrollment.create({ data: { id: 'e2', studentId: 's1', courseId: 'c4', status: 'approved', progress: 40, grade: 78 } }),
    prisma.enrollment.create({ data: { id: 'e3', studentId: 's1', courseId: 'c5', status: 'pending', progress: 0 } }),
    prisma.enrollment.create({ data: { id: 'e4', studentId: 's2', courseId: 'c2', status: 'approved', progress: 80, grade: 92 } }),
    prisma.enrollment.create({ data: { id: 'e5', studentId: 's2', courseId: 'c3', status: 'approved', progress: 55, grade: 88 } }),
    prisma.enrollment.create({ data: { id: 'e6', studentId: 's3', courseId: 'c4', status: 'approved', progress: 30, grade: 72 } }),
    prisma.enrollment.create({ data: { id: 'e7', studentId: 's4', courseId: 'c3', status: 'approved', progress: 70, grade: 90 } }),
    prisma.enrollment.create({ data: { id: 'e8', studentId: 's5', courseId: 'c5', status: 'approved', progress: 20, grade: 74 } }),
    prisma.enrollment.create({ data: { id: 'e9', studentId: 's6', courseId: 'c3', status: 'approved', progress: 60, grade: 95 } }),
    prisma.enrollment.create({ data: { id: 'e10', studentId: 's7', courseId: 'c6', status: 'approved', progress: 45, grade: 82 } }),
    prisma.enrollment.create({ data: { id: 'e11', studentId: 's8', courseId: 'c1', status: 'approved', progress: 90, grade: 95 } }),
  ]);
  console.log('Enrollments created');

  // Create Attendance records
  const attendanceData: { studentId: string; courseId: string; date: Date; status: string; markedBy: string }[] = [];
  const students = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];
  const courseIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  const statuses = ['present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late'];
  let attId = 0;
  for (const sid of students) {
    for (const cid of courseIds) {
      for (let d = 1; d <= 5; d++) {
        attId++;
        attendanceData.push({
          studentId: sid,
          courseId: cid,
          date: new Date(2026, 1, d + 10),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          markedBy: 't1',
        });
      }
    }
  }
  await prisma.attendance.createMany({ data: attendanceData });
  console.log('Attendance created');

  // Create Payments
  await Promise.all([
    prisma.payment.create({ data: { id: 'p1', enrollmentId: 'e1', amount: 15000, currency: 'DZD', status: 'verified', verifiedBy: 'a1', verifiedAt: new Date(), paymentMethod: 'transfer' } }),
    prisma.payment.create({ data: { id: 'p2', enrollmentId: 'e2', amount: 10000, currency: 'DZD', status: 'verified', verifiedBy: 'a1', verifiedAt: new Date(), paymentMethod: 'transfer' } }),
    prisma.payment.create({ data: { id: 'p3', enrollmentId: 'e3', amount: 14000, currency: 'DZD', status: 'pending', paymentMethod: 'transfer' } }),
    prisma.payment.create({ data: { id: 'p4', enrollmentId: 'e4', amount: 12000, currency: 'DZD', status: 'verified', verifiedBy: 'a1', verifiedAt: new Date(), paymentMethod: 'transfer' } }),
    prisma.payment.create({ data: { id: 'p5', enrollmentId: 'e5', amount: 18000, currency: 'DZD', status: 'rejected', verifiedBy: 'a1', verifiedAt: new Date(), paymentMethod: 'transfer' } }),
  ]);
  console.log('Payments created');

  // Create Skills
  await Promise.all([
    prisma.skill.create({ data: { id: 'sk1', userId: 's1', name: 'English Speaking', level: 6, category: 'language', badge: '🗣️' } }),
    prisma.skill.create({ data: { id: 'sk2', userId: 's1', name: 'English Writing', level: 5, category: 'language', badge: '✍️' } }),
    prisma.skill.create({ data: { id: 'sk3', userId: 's1', name: 'Mathematical Logic', level: 4, category: 'math', badge: '🧮' } }),
    prisma.skill.create({ data: { id: 'sk4', userId: 's1', name: 'Scientific Thinking', level: 3, category: 'science', badge: '🔬' } }),
    prisma.skill.create({ data: { id: 'sk5', userId: 's1', name: 'Teamwork', level: 7, category: 'soft', badge: '🤝' } }),
    prisma.skill.create({ data: { id: 'sk6', userId: 's1', name: 'Critical Thinking', level: 5, category: 'soft', badge: '🧠' } }),
  ]);
  console.log('Skills created');

  // Create Gamification
  await prisma.gamification.create({
    data: { id: 'g1', userId: 's1', points: 2450, level: 12, streak: 7, badges: '["first_enrollment","week_streak","top_scorer","quick_learner","attendance_star","team_player"]', rank: 3 },
  });
  await prisma.gamification.create({
    data: { id: 'g2', userId: 's2', points: 3100, level: 14, streak: 10, badges: '["first_enrollment","week_streak","language_master"]', rank: 1 },
  });
  await prisma.gamification.create({
    data: { id: 'g3', userId: 's8', points: 2980, level: 14, streak: 9, badges: '["first_enrollment","top_scorer"]', rank: 2 },
  });
  console.log('Gamification created');

  // Create Notifications
  await Promise.all([
    prisma.notification.create({ data: { id: 'n1', userId: 's1', title: 'مرحباً بك!', message: 'تم تسجيلك بنجاح في منصة تشامبس سكول', type: 'success', isRead: false } }),
    prisma.notification.create({ data: { id: 'n2', userId: 's1', title: 'شارة جديدة!', message: 'حصلت على شارة "حضور متميز"', type: 'achievement', isRead: false } }),
    prisma.notification.create({ data: { id: 'n3', userId: 's1', title: 'تذكير بالحضور', message: 'حصة الإنجليزية غداً الساعة 9:00', type: 'info', isRead: true } }),
    prisma.notification.create({ data: { id: 'n4', userId: 's1', title: 'اقتراح ذكي', message: 'بناءً على تقدمك، ننصحك بدورة الفرنسية المتوسطة', type: 'info', isRead: false } }),
    prisma.notification.create({ data: { id: 'n5', userId: 's1', title: 'تنبيه حضور', message: 'تم تسجيل غيابك في حصة الأمس. يرجى التواصل مع المعلم', type: 'warning', isRead: false } }),
    prisma.notification.create({ data: { id: 'n6', userId: 's1', title: 'إنجاز رائع!', message: 'حصلت على المركز الثالث في لوحة المتصدرين هذا الأسبوع', type: 'achievement', isRead: true } }),
  ]);
  console.log('Notifications created');

  // Create Testimonials
  await Promise.all([
    prisma.testimonial.create({ data: { id: 't1', name: 'أحمد بلال', role: 'طالب لغة إنجليزية', content: 'منصة رائعة ساعدتني على تطوير مهاراتي اللغوية بشكل كبير. نظام النقاط والشارات يحفزني كل يوم!', contentAr: 'منصة رائعة ساعدتني على تطوير مهاراتي اللغوية بشكل كبير', rating: 5, isActive: true } }),
    prisma.testimonial.create({ data: { id: 't2', name: 'مريم سعيد', role: 'طالبة لغة فرنسية', content: 'أفضل مدرسة تعليمية. المعلمون محترفون والمنصة سهلة الاستخدام ومليئة بالميزات المفيدة.', contentAr: 'أفضل مدرسة تعليمية. المعلمون محترفون والمنصة سهلة الاستخدام', rating: 5, isActive: true } }),
    prisma.testimonial.create({ data: { id: 't3', name: 'كريم يوسف', role: 'ولي أمر', content: 'أستطيع متابعة تقدم ابني بشكل يومي. الإشعارات والتقارير مفيدة جداً لكل ولي أمر.', contentAr: 'أستطيع متابعة تقدم ابني بشكل يومي. الإشعارات والتقارير مفيدة جداً', rating: 4, isActive: true } }),
    prisma.testimonial.create({ data: { id: 't4', name: 'سارة حسن', role: 'معلمة', content: 'المنصة تجعل إدارة الفصول ومتابعة الطلاب سهلة جداً. أدوات التحليلات ممتازة.', contentAr: 'المنصة تجعل إدارة الفصول ومتابعة الطلاب سهلة جداً', rating: 5, isActive: true } }),
  ]);
  console.log('Testimonials created');

  // Create Settings
  await Promise.all([
    prisma.setting.create({ data: { id: 'set1', key: 'school_name', value: 'Champs School' } }),
    prisma.setting.create({ data: { id: 'set2', key: 'school_name_ar', value: 'تشامبس سكول' } }),
    prisma.setting.create({ data: { id: 'set3', key: 'default_language', value: 'ar' } }),
    prisma.setting.create({ data: { id: 'set4', key: 'currency', value: 'DZD' } }),
    prisma.setting.create({ data: { id: 'set5', key: 'max_enrollment', value: '30' } }),
    prisma.setting.create({ data: { id: 'set6', key: 'contact_email', value: 'info@champs.dz' } }),
    prisma.setting.create({ data: { id: 'set7', key: 'contact_phone', value: '+213 555 123 456' } }),
    prisma.setting.create({ data: { id: 'set8', key: 'contact_address', value: 'شارع ديدوش مراد، الجزائر العاصمة' } }),
  ]);
  console.log('Settings created');

  // Create Leaderboard entries
  await Promise.all([
    prisma.leaderboard.create({ data: { userId: 's2', period: 'weekly', points: 3100, rank: 1 } }),
    prisma.leaderboard.create({ data: { userId: 's8', period: 'weekly', points: 2980, rank: 2 } }),
    prisma.leaderboard.create({ data: { userId: 's1', period: 'weekly', points: 2450, rank: 3 } }),
    prisma.leaderboard.create({ data: { userId: 's2', period: 'monthly', points: 12400, rank: 1 } }),
    prisma.leaderboard.create({ data: { userId: 's8', period: 'monthly', points: 11800, rank: 2 } }),
    prisma.leaderboard.create({ data: { userId: 's1', period: 'monthly', points: 9800, rank: 3 } }),
  ]);
  console.log('Leaderboard created');

  // Create Events
  await Promise.all([
    prisma.event.create({ data: { id: 'ev1', title: 'رحلة علمية إلى المتحف', titleAr: 'رحلة علمية إلى المتحف', description: 'رحلة تعليمية لمتحف الباردو الوطني', descriptionAr: 'رحلة تعليمية لمتحف الباردو الوطني', date: new Date('2026-03-10'), endDate: new Date('2026-03-10'), location: 'متحف الباردو', category: 'trip' } }),
    prisma.event.create({ data: { id: 'ev2', title: 'مسابقة الخطابة العربية', titleAr: 'مسابقة الخطابة العربية', description: 'المسابقة السنوية للخطابة العربية', descriptionAr: 'المسابقة السنوية للخطابة العربية', date: new Date('2026-03-15'), endDate: new Date('2026-03-15'), location: 'قاعة المحاضرات', category: 'competition' } }),
  ]);
  console.log('Events created');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
