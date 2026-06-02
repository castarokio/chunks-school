import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
      price: course.price,
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

    // Check for admin authorization (simplified)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!title || !description || !category || !level || !price || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, level, price, teacherId' },
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
        price,
        currency: currency || 'DZD',
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
