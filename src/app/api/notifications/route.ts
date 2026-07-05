import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { NotificationType } from '@/lib/types';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';

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
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unread') === 'true';
    const adminScope = searchParams.get('scope') === 'all' && isAdminRole(user.role);

    const where: Record<string, unknown> = adminScope ? {} : { userId: user.id };
    if (type) where.type = type;
    if (unreadOnly) where.isRead = false;

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: adminScope ? 100 : undefined,
      include: adminScope ? {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      } : undefined,
    });

    const unreadCount = await db.notification.count({
      where: adminScope ? { isRead: false } : { userId: user.id, isRead: false },
    });

    return NextResponse.json({
      success: true,
      notifications: notifications.map((notification) => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
      })),
      total: notifications.length,
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
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
    const { userId: requestedUserId, title, message, type } = body;
    const isAdmin = isAdminRole(user.role);
    const userId = isAdmin ? requestedUserId : user.id;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: 'title and message are required' },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error', 'achievement'];
    const notificationType: NotificationType = validTypes.includes(type) ? type : 'info';

    if (isAdmin && userId === 'all') {
      const recipients = await db.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      await db.notification.createMany({
        data: recipients.map((recipient) => ({
          userId: recipient.id,
          title,
          message,
          type: notificationType,
        })),
      });

      return NextResponse.json(
        {
          success: true,
          recipientCount: recipients.length,
          message: 'Notification broadcast successfully',
        },
        { status: 201 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        type: notificationType,
      },
    });

    return NextResponse.json(
      {
        success: true,
        notification: {
          ...notification,
          createdAt: notification.createdAt.toISOString(),
        },
        message: 'Notification created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Notifications POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
