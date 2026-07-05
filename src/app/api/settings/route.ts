import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/server-auth';
import type { Language } from '@/lib/types';

const validLanguages: Language[] = ['ar', 'en', 'fr'];

function preferencesKey(userId: string) {
  return `user:${userId}:preferences`;
}

async function getPreferences(userId: string) {
  const row = await db.setting.findUnique({
    where: { key: preferencesKey(userId) },
  });

  if (!row) return {};

  try {
    return JSON.parse(row.value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        language: true,
        role: true,
        twoFactorEnabled: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: dbUser,
      preferences: await getPreferences(user.id),
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      language,
      twoFactorEnabled,
      preferences,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      );
    }

    if (language && !validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        phone: phone || null,
        language: language || undefined,
        twoFactorEnabled: Boolean(twoFactorEnabled),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        language: true,
        role: true,
        twoFactorEnabled: true,
      },
    });

    const savedPreferences = preferences && typeof preferences === 'object'
      ? preferences
      : {};

    await db.setting.upsert({
      where: { key: preferencesKey(user.id) },
      create: {
        key: preferencesKey(user.id),
        value: JSON.stringify(savedPreferences),
      },
      update: {
        value: JSON.stringify(savedPreferences),
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      preferences: savedPreferences,
    });
  } catch (error) {
    console.error('Settings PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
