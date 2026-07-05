import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        subject: String(subject).trim(),
        message: String(message).trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: {
          ...contactMessage,
          createdAt: contactMessage.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access only' },
        { status: 403 }
      );
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      messages: messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      })),
      total: messages.length,
    });
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
