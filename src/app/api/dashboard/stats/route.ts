import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { role, id: userId } = user;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalCourses = await db.course.count({ where: { status: 'active' } });
    const [coursesThisMonth, coursesPreviousMonth] = await Promise.all([
      db.course.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.course.count({
        where: {
          createdAt: {
            gte: startOfPreviousMonth,
            lt: startOfMonth,
          },
        },
      }),
    ]);
    const monthlyGrowth = coursesPreviousMonth > 0
      ? Math.round(((coursesThisMonth - coursesPreviousMonth) / coursesPreviousMonth) * 100)
      : coursesThisMonth > 0 ? 100 : 0;
    const publicStats = {
      totalCourses,
      monthlyGrowth,
    };

    let stats: Record<string, unknown>;

    switch (role) {
      case 'student': {
        const studentEnrollments = await db.enrollment.findMany({
          where: { studentId: userId },
          include: { course: true },
        });
        const activeCount = studentEnrollments.filter((e) => e.status === 'approved').length;
        const gradesEnrollments = studentEnrollments.filter((e) => e.grade !== null);
        const avgGrade = gradesEnrollments.length > 0
          ? gradesEnrollments.reduce((sum, e) => sum + (e.grade || 0), 0) / gradesEnrollments.length
          : 0;
        const avgProgress = studentEnrollments.length > 0
          ? studentEnrollments.reduce((sum, e) => sum + e.progress, 0) / studentEnrollments.length
          : 0;

        stats = {
          ...publicStats,
          enrolledCourses: studentEnrollments.length,
          activeCourses: activeCount,
          averageGrade: Math.round(avgGrade),
          overallProgress: Math.round(avgProgress),
        };
        break;
      }

      case 'teacher': {
        const teacherCourses = await db.course.findMany({
          where: { teacherId: userId },
          include: { _count: { select: { enrollments: true } } },
        });
        const myStudents = teacherCourses.reduce((sum, c) => sum + c._count.enrollments, 0);

        stats = {
          ...publicStats,
          myCourses: teacherCourses.length,
          totalStudents: myStudents,
        };
        break;
      }

      case 'parent': {
        // Find children linked to this parent
        const children = await db.user.findMany({
          where: { parentId: userId },
          include: { enrollments: true },
        });
        const childrenActiveCourses = children.reduce(
          (sum, c) => sum + c.enrollments.filter((e) => e.status === 'approved').length,
          0
        );
        const grades = children.flatMap((child) =>
          child.enrollments
            .map((enrollment) => enrollment.grade)
            .filter((grade): grade is number => typeof grade === 'number')
        );
        const childrenAverageGrade = grades.length > 0
          ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
          : 0;

        stats = {
          ...publicStats,
          childrenCount: children.length,
          childrenActiveCourses,
          childrenAverageGrade,
          upcomingSessions: childrenActiveCourses,
        };
        break;
      }

      case 'admin':
      case 'admin_manager':
      case 'owner': {
        const totalStudents = await db.user.count({ where: { role: 'student', isActive: true } });
        const totalTeachers = await db.user.count({ where: { role: 'teacher', isActive: true } });
        const activeEnrollments = await db.enrollment.count({ where: { status: 'approved' } });
        const revenueResult = await db.payment.aggregate({
          _sum: { amountMinor: true },
          where: { status: 'verified' },
        });
        const totalRevenue = revenueResult._sum.amountMinor || 0;
        const totalAttendance = await db.attendance.count();
        const presentAttendance = await db.attendance.count({ where: { status: 'present' } });
        const attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;
        const pendingEnrollments = await db.enrollment.count({ where: { status: 'pending' } });
        const pendingPayments = await db.payment.count({ where: { status: 'pending' } });
        const newStudentsThisMonth = await db.user.count({
          where: {
            role: 'student',
            isActive: true,
            createdAt: { gte: startOfMonth },
          },
        });
        const completedEnrollments = await db.enrollment.count({ where: { status: 'completed' } });
        const totalFinishedEnrollments = await db.enrollment.count({
          where: { status: { in: ['approved', 'completed'] } },
        });
        const courseCompletionRate = totalFinishedEnrollments > 0
          ? Math.round((completedEnrollments / totalFinishedEnrollments) * 100)
          : 0;

        stats = {
          totalStudents,
          totalTeachers,
          totalCourses,
          totalRevenue,
          activeEnrollments,
          attendanceRate,
          monthlyGrowth,
          pendingEnrollments,
          monthlyRevenue: totalRevenue,
          pendingPayments,
          newStudentsThisMonth,
          courseCompletionRate,
        };
        break;
      }

      default:
        if (!isAdminRole(role)) {
          return NextResponse.json(
            { error: 'Unauthorized role' },
            { status: 403 }
          );
        }
        stats = publicStats;
    }

    return NextResponse.json({
      success: true,
      stats,
      role,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
