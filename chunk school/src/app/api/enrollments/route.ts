import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;

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
        price: e.course.price,
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
    const body = await request.json();
    const { studentId, courseId } = body;

    // Validate required fields
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'studentId and courseId are required' },
        { status: 400 }
      );
    }

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });

    if (existingEnrollment && existingEnrollment.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Student is already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create enrollment
    const newEnrollment = await db.enrollment.create({
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
            price: newEnrollment.course.price,
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
    console.error('Enrollments POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
