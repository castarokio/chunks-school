import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';
import { fromMinorUnits } from '@/lib/money';

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
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;

    if (user.role === 'student') {
      where.studentId = user.id;
    } else if (user.role === 'parent') {
      const children = await db.user.findMany({
        where: { parentId: user.id },
        select: { id: true },
      });
      where.studentId = { in: children.map((child) => child.id) };
    } else if (user.role === 'teacher') {
      where.course = { teacherId: user.id };
    } else if (!isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized role' },
        { status: 403 }
      );
    }

    const enrollments = await db.enrollment.findMany({
      where,
      include: {
        course: {
          include: {
            teacher: { select: { name: true } },
            _count: { select: { enrollments: true } },
          },
        },
        student: { select: { name: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Transform to match frontend expected format
    const transformed = enrollments.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      courseId: e.courseId,
      status: e.status,
      enrolledAt: e.enrolledAt.toISOString().split('T')[0],
      completedAt: e.completedAt?.toISOString().split('T')[0] || undefined,
      progress: e.progress,
      grade: e.grade,
      course: {
        id: e.course.id,
        title: e.course.title,
        titleAr: e.course.titleAr,
        titleFr: e.course.titleFr,
        description: e.course.description,
        descriptionAr: e.course.descriptionAr,
        descriptionFr: e.course.descriptionFr,
        category: e.course.category,
        level: e.course.level,
        price: fromMinorUnits(e.course.priceMinor, e.course.currency),
        priceMinor: e.course.priceMinor,
        currency: e.course.currency,
        capacity: e.course.capacity,
        schedule: e.course.schedule,
        startDate: e.course.startDate,
        endDate: e.course.endDate,
        status: e.course.status,
        teacherId: e.course.teacherId,
        teacherName: e.course.teacher.name,
        enrolledCount: e.course._count.enrollments,
      },
    }));

    return NextResponse.json({
      success: true,
      enrollments: transformed,
      total: transformed.length,
    });
  } catch (error) {
    console.error('Enrollments GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { studentId: requestedStudentId, courseId } = body;
    const studentId = user.role === 'student' ? user.id : requestedStudentId;

    // Validate required fields
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'studentId and courseId are required' },
        { status: 400 }
      );
    }

    if (user.role === 'parent') {
      const child = await db.user.findFirst({
        where: { id: studentId, parentId: user.id, role: 'student', isActive: true },
        select: { id: true },
      });

      if (!child) {
        return NextResponse.json(
          { error: 'Forbidden: You can only enroll linked children' },
          { status: 403 }
        );
      }
    } else if (!isAdminRole(user.role) && user.role !== 'student') {
      return NextResponse.json(
        { error: 'Forbidden: Students, parents, or admins only' },
        { status: 403 }
      );
    }

    const newEnrollment = await db.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new Error('COURSE_NOT_FOUND');
      }

      if (course.status !== 'active') {
        throw new Error('COURSE_NOT_ACTIVE');
      }

      const now = new Date();
      if (course.endDate < now) {
        throw new Error('COURSE_ENDED');
      }

      const activeEnrollmentCount = await tx.enrollment.count({
        where: {
          courseId,
          status: { in: ['pending', 'approved'] },
        },
      });

      if (activeEnrollmentCount >= course.capacity) {
        throw new Error('COURSE_FULL');
      }

      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          studentId_courseId: { studentId, courseId },
        },
      });

      if (existingEnrollment && existingEnrollment.status !== 'rejected') {
        throw new Error('ALREADY_ENROLLED');
      }

      return tx.enrollment.create({
        data: {
          studentId,
          courseId,
          status: 'pending',
          progress: 0,
        },
        include: {
          course: {
            include: {
              teacher: { select: { name: true } },
              _count: { select: { enrollments: true } },
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        enrollment: {
          id: newEnrollment.id,
          studentId: newEnrollment.studentId,
          courseId: newEnrollment.courseId,
          status: newEnrollment.status,
          enrolledAt: newEnrollment.enrolledAt.toISOString().split('T')[0],
          progress: newEnrollment.progress,
          course: {
            id: newEnrollment.course.id,
            title: newEnrollment.course.title,
            titleAr: newEnrollment.course.titleAr,
            titleFr: newEnrollment.course.titleFr,
            description: newEnrollment.course.description,
            category: newEnrollment.course.category,
            level: newEnrollment.course.level,
            price: fromMinorUnits(newEnrollment.course.priceMinor, newEnrollment.course.currency),
            priceMinor: newEnrollment.course.priceMinor,
            currency: newEnrollment.course.currency,
            capacity: newEnrollment.course.capacity,
            schedule: newEnrollment.course.schedule,
            startDate: newEnrollment.course.startDate,
            endDate: newEnrollment.course.endDate,
            status: newEnrollment.course.status,
            teacherId: newEnrollment.course.teacherId,
            teacherName: newEnrollment.course.teacher.name,
            enrolledCount: newEnrollment.course._count.enrollments,
          },
        },
        message: 'Enrollment created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      const errorMap: Record<string, { error: string; status: number }> = {
        COURSE_NOT_FOUND: { error: 'Course not found', status: 404 },
        COURSE_NOT_ACTIVE: { error: 'Course is not active', status: 400 },
        COURSE_ENDED: { error: 'Course enrollment period has ended', status: 400 },
        COURSE_FULL: { error: 'Course is full', status: 409 },
        ALREADY_ENROLLED: { error: 'Student is already enrolled in this course', status: 409 },
      };
      const mapped = errorMap[error.message];
      if (mapped) {
        return NextResponse.json(
          { error: mapped.error },
          { status: mapped.status }
        );
      }
    }
    console.error('Enrollments POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    // Only allow admins, admin_managers, and owners
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { enrollmentId, status } = body;

    if (!enrollmentId || !status) {
      return NextResponse.json(
        { error: 'enrollmentId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
      include: {
        course: {
          select: { title: true },
        },
        student: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      enrollment: updatedEnrollment,
      message: `Enrollment status updated to ${status}`,
    });
  } catch (error) {
    console.error('Enrollments PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
