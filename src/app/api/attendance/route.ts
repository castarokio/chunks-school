import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';

// GET: Retrieve attendance logs
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const dateParam = searchParams.get('date');

    const where: Record<string, any> = {};

    // Role-based filtering
    if (user.role === 'student') {
      where.studentId = user.id;
      if (courseId) where.courseId = courseId;
    } else if (user.role === 'parent') {
      const children = await db.user.findMany({
        where: { parentId: user.id },
        select: { id: true },
      });
      where.studentId = { in: children.map((child) => child.id) };
      if (courseId) where.courseId = courseId;
    } else if (user.role === 'teacher') {
      // Teachers must specify a course, or we filter by courses they teach
      if (courseId) {
        where.courseId = courseId;
      } else {
        // Find teacher's courses
        const teacherCourses = await db.course.findMany({
          where: { teacherId: user.id },
          select: { id: true }
        });
        where.courseId = { in: teacherCourses.map((c) => c.id) };
      }

      if (dateParam) {
        const parsedDate = new Date(dateParam);
        // Match start and end of day to be safe with timezone issues in SQLite
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
        where.date = {
          gte: startOfDay,
          lte: endOfDay
        };
      }
    } else if (isAdminRole(user.role)) {
      if (courseId) where.courseId = courseId;
      if (dateParam) {
        const parsedDate = new Date(dateParam);
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
        where.date = {
          gte: startOfDay,
          lte: endOfDay
        };
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized role' },
        { status: 401 }
      );
    }

    const logs = await db.attendance.findMany({
      where,
      include: {
        student: { select: { name: true, email: true } },
        course: { select: { title: true, titleAr: true } }
      },
      orderBy: { date: 'desc' }
    });

    const transformed = logs.map((log) => ({
      id: log.id,
      studentId: log.studentId,
      studentName: log.student.name,
      courseId: log.courseId,
      courseTitle: log.course.title,
      courseTitleAr: log.course.titleAr,
      date: log.date.toISOString().split('T')[0],
      status: log.status, // present, absent, late, excused
      notes: log.notes || ''
    }));

    return NextResponse.json({
      success: true,
      logs: transformed,
      total: transformed.length
    });
  } catch (error) {
    console.error('Attendance GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Save attendance checklist (Teacher/Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    // Only allow teachers, admins, and owners
    if (!user || (user.role !== 'teacher' && !isAdminRole(user.role))) {
      return NextResponse.json(
        { error: 'Forbidden: Teacher/Admin access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, date, records } = body; // records: [{ studentId, status, notes }]

    if (!courseId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'courseId, date (YYYY-MM-DD), and records array are required' },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await db.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Teachers can only mark attendance for their own courses
    if (user.role === 'teacher' && course.teacherId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only mark attendance for your own courses' },
        { status: 403 }
      );
    }

    // Convert date string YYYY-MM-DD to Date object at noon to prevent timezone shifts
    const parsedDate = new Date(`${date}T12:00:00.000Z`);

    // Clean existing attendance entries for this course and date to prevent duplicates (Idempotent)
    const startOfDay = new Date(new Date(`${date}T00:00:00.000Z`).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(`${date}T23:59:59.000Z`).setHours(23, 59, 59, 999));

    const studentIds = records.map((r) => r.studentId);
    const validEnrollments = await db.enrollment.count({
      where: {
        courseId,
        studentId: { in: studentIds },
        status: { in: ['approved', 'completed'] },
      },
    });

    if (validEnrollments !== studentIds.length) {
      return NextResponse.json(
        { error: 'All attendance records must belong to enrolled students for this course' },
        { status: 400 }
      );
    }

    await db.$transaction([
      db.attendance.deleteMany({
        where: {
          courseId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      db.attendance.createMany({
        data: records.map((r) => ({
          studentId: r.studentId,
          courseId,
          date: parsedDate,
          status: r.status,
          notes: r.notes || null,
          markedBy: user.id
        }))
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Attendance saved successfully',
      recordsCount: records.length
    });
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
