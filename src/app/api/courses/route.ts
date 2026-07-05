import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';
import { fromMinorUnits, toMinorUnits } from '@/lib/money';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (level) where.level = level;
    if (status) where.status = status;

    const courses = await db.course.findMany({
      where,
      include: {
        teacher: {
          select: { id: true, name: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match the frontend expected format
    const transformedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      titleAr: course.titleAr,
      titleFr: course.titleFr,
      description: course.description,
      descriptionAr: course.descriptionAr,
      descriptionFr: course.descriptionFr,
      category: course.category,
      level: course.level,
      price: fromMinorUnits(course.priceMinor, course.currency),
      priceMinor: course.priceMinor,
      currency: course.currency,
      capacity: course.capacity,
      schedule: course.schedule,
      startDate: course.startDate,
      endDate: course.endDate,
      status: course.status,
      imageUrl: course.imageUrl,
      teacherId: course.teacherId,
      teacherName: course.teacher.name,
      enrolledCount: course._count.enrollments,
    }));

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
      total: transformedCourses.length,
    });
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      titleAr,
      titleFr,
      description,
      descriptionAr,
      descriptionFr,
      category,
      level,
      price,
      currency,
      capacity,
      schedule,
      startDate,
      endDate,
      teacherId,
    } = body;

    // Check for admin authorization
    const user = await getCurrentUser(request);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Admins only' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!title || !description || !category || !level || !price || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, level, price, teacherId' },
        { status: 400 }
      );
    }

    const courseCurrency = currency || 'DZD';
    const priceMinor = toMinorUnits(price, courseCurrency);
    if (!priceMinor) {
      return NextResponse.json(
        { error: 'price must be a positive number' },
        { status: 400 }
      );
    }

    // Verify teacher exists
    const teacher = await db.user.findUnique({
      where: { id: teacherId, role: 'teacher' },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    const newCourse = await db.course.create({
      data: {
        title,
        titleAr: titleAr || null,
        titleFr: titleFr || null,
        description,
        descriptionAr: descriptionAr || null,
        descriptionFr: descriptionFr || null,
        category,
        level,
        priceMinor,
        currency: courseCurrency,
        capacity: capacity || 25,
        schedule: schedule || '{}',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date('2026-06-30'),
        status: 'active',
        teacherId,
      },
      include: {
        teacher: {
          select: { id: true, name: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        course: {
          ...newCourse,
          price: fromMinorUnits(newCourse.priceMinor, newCourse.currency),
          teacherName: newCourse.teacher.name,
          enrolledCount: newCourse._count.enrollments,
        },
        message: 'Course created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Courses POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
