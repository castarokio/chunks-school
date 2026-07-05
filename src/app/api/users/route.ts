import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { canCreateRole, getCurrentUser, isAdminRole } from '@/lib/server-auth';

// GET: Retrieve all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    // Only allow admins, admin_managers, and owners
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access only' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role');

    const where: Record<string, unknown> = {};

    if (roleFilter && roleFilter !== 'all') {
      where.role = roleFilter;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ];
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        language: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Register a user directly (Admin only)
export async function POST(request: NextRequest) {
  try {
    const requester = await getCurrentUser(request);

    // Only allow admins, admin_managers, and owners
    if (!requester || !isAdminRole(requester.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, phone, language } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, role' },
        { status: 400 }
      );
    }

    const validRoles = ['student', 'teacher', 'parent', 'admin', 'admin_manager', 'owner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    if (!canCreateRole(requester.role, role)) {
      return NextResponse.json(
        { error: 'Forbidden: insufficient privileges for requested role' },
        { status: 403 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role,
        phone: phone || null,
        language: language || 'ar',
        isActive: true,
      },
    });

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin users create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
