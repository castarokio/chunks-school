import { NextRequest, NextResponse } from 'next/server';
import { mockNotifications } from '@/lib/mock-data';
import type { Notification, NotificationType } from '@/lib/types';

// In-memory store for any newly created notifications
const createdNotifications: Notification[] = [];
let notificationCounter = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 's1';
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unread') === 'true';

    // Combine mock notifications with any dynamically created ones
    let allNotifications = [...mockNotifications, ...createdNotifications];

    // Filter by userId
    allNotifications = allNotifications.filter((n) => n.userId === userId);

    // Filter by type if provided
    if (type) {
      allNotifications = allNotifications.filter((n) => n.type === type);
    }

    // Filter unread only
    if (unreadOnly) {
      allNotifications = allNotifications.filter((n) => !n.isRead);
    }

    // Sort by creation date (newest first)
    allNotifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unreadCount = allNotifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications: allNotifications,
      total: allNotifications.length,
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
    const body = await request.json();
    const { userId, title, message, type } = body;

    // Validate required fields
    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'userId, title, and message are required' },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error', 'achievement'];
    const notificationType: NotificationType = validTypes.includes(type) ? type : 'info';

    notificationCounter++;
    const newNotification: Notification = {
      id: `n${notificationCounter}`,
      userId,
      title,
      message,
      type: notificationType,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    createdNotifications.push(newNotification);

    return NextResponse.json(
      {
        success: true,
        notification: newNotification,
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
