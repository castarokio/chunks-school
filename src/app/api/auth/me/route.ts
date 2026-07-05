import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or deactivated' },
        { status: 401 }
      );
    }

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
