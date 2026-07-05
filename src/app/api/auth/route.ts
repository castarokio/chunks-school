import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';
import { checkRateLimit, getClientIp, normalizeRateLimitPart } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const emailKey = normalizeRateLimitPart(email);
    const ipKey = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${ipKey}:${emailKey}`, 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact administration.' },
        { status: 403 }
      );
    }

    // Return user data (without password)
    const { password: _, ...safeUser } = user;

    // Generate real signed JWT
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Login successful',
    });

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
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
