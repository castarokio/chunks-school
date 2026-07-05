import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';
import { fromMinorUnits } from '@/lib/money';
import { createSignedReadUrl } from '@/lib/storage';

// GET: Retrieve payments list (filtered by role)
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
    const status = searchParams.get('status');

    const where: Record<string, any> = {};
    if (status) where.status = status;

    // Role-based scoping
    if (user.role === 'student') {
      where.enrollment = {
        studentId: user.id
      };
    } else if (user.role === 'parent') {
      const children = await db.user.findMany({
        where: { parentId: user.id },
        select: { id: true },
      });
      where.enrollment = {
        studentId: { in: children.map((child) => child.id) },
      };
    } else if (!isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized role' },
        { status: 403 }
      );
    }

    const payments = await db.payment.findMany({
      where,
      include: {
        enrollment: {
          include: {
            student: { select: { name: true, email: true } },
            course: { select: { title: true, titleAr: true, priceMinor: true, currency: true } }
          }
        },
        verifier: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const transformed = await Promise.all(payments.map(async (p) => ({
      id: p.id,
      enrollmentId: p.enrollmentId,
      studentName: p.enrollment?.student?.name || 'Unknown',
      studentEmail: p.enrollment?.student?.email || '',
      courseTitle: p.enrollment?.course?.title || 'Unknown',
      courseTitleAr: p.enrollment?.course?.titleAr || '',
      courseName: p.enrollment?.course?.title || 'Unknown', // Compatibility with frontend
      amount: fromMinorUnits(p.amountMinor, p.currency),
      amountMinor: p.amountMinor,
      currency: p.currency,
      status: p.status,
      proofKey: p.proofKey,
      proofUrl: p.proofKey ? await createSignedReadUrl(p.proofKey) : null,
      paymentMethod: p.paymentMethod || 'Bank Transfer',
      createdAt: p.createdAt.toISOString().split('T')[0],
      submittedAt: p.createdAt.toISOString().split('T')[0], // Compatibility with frontend
      verifiedBy: p.verifier?.name || null,
      verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString().split('T')[0] : null
    })));

    return NextResponse.json({
      success: true,
      payments: transformed,
      total: transformed.length
    });
  } catch (error) {
    console.error('Payments GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Submit payment proof (Student only)
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
    const { enrollmentId, proofKey, paymentMethod } = body;

    if (!enrollmentId || !proofKey) {
      return NextResponse.json(
        { error: 'enrollmentId and proofKey are required' },
        { status: 400 }
      );
    }

    if (typeof proofKey !== 'string' || !proofKey.startsWith(`payment-proofs/${user.id}/`)) {
      return NextResponse.json(
        { error: 'Invalid proofKey. Upload payment proof before submitting payment.' },
        { status: 400 }
      );
    }

    // Verify enrollment belongs to student
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: true,
        course: { select: { priceMinor: true, currency: true } },
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Students can only pay for their own enrollments
    if (user.role === 'student') {
      if (enrollment.studentId !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden: You can only pay for your own enrollments' },
          { status: 403 }
        );
      }
    } else if (user.role === 'parent') {
      const child = await db.user.findFirst({
        where: { id: enrollment.studentId, parentId: user.id },
        select: { id: true },
      });

      if (!child) {
        return NextResponse.json(
          { error: 'Forbidden: You can only pay for linked children' },
          { status: 403 }
        );
      }
    } else if (!isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Students, parents, or admins only' },
        { status: 403 }
      );
    }

    const existingPendingPayment = await db.payment.findFirst({
      where: {
        enrollmentId,
        status: 'pending',
      },
      select: { id: true },
    });

    if (existingPendingPayment) {
      return NextResponse.json(
        { error: 'A pending payment already exists for this enrollment' },
        { status: 409 }
      );
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        enrollmentId,
        amountMinor: enrollment.course.priceMinor,
        currency: enrollment.course.currency,
        status: 'pending',
        proofKey,
        paymentMethod: paymentMethod || 'Bank Transfer'
      }
    });

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment proof submitted successfully'
    });
  } catch (error) {
    console.error('Payments POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Verify or Reject payment (Admin only)
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
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'paymentId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updatedPayment = await db.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status,
          verifiedBy: user.id,
          verifiedAt: status !== 'pending' ? new Date() : null
        }
      });

      if (status === 'verified') {
        await tx.enrollment.update({
          where: { id: payment.enrollmentId },
          data: { status: 'approved' }
        });
      } else if (status === 'rejected') {
        await tx.enrollment.update({
          where: { id: payment.enrollmentId },
          data: { status: 'rejected' }
        });
      }

      return payment;
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: `Payment status updated to ${status}`
    });
  } catch (error) {
    console.error('Payments PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
