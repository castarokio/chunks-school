import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';
import { checkRateLimit, getClientIp, normalizeRateLimitPart } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, language, phone } = body;
    const rateLimit = checkRateLimit(
      `register:${getClientIp(request)}:${normalizeRateLimitPart(email)}`,
      5,
      60_000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      );
    }

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Public self-registration is intentionally limited to non-privileged roles.
    const validRoles = ['student', 'parent'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await db.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role,
        language: language || 'ar',
        phone: phone || null,
      },
    });

    // Return user data without password
    const { password: _, ...safeUser } = newUser;

    // Generate real signed JWT
    const token = await signJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: safeUser,
        message: 'Registration successful',
      },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
