import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { badgeInfo } from '@/lib/mock-data';
import { getCurrentUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = user.id;

    const gamificationRecord = await db.gamification.upsert({
      where: { userId },
      create: {
        userId,
        points: 0,
        level: 1,
        streak: 0,
        badges: '[]',
        rank: 0,
      },
      update: {},
    });

    const skills = await db.skill.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });

    const leaderboardRows = await db.leaderboard.findMany({
      where: { period: 'all_time' },
      orderBy: [{ rank: 'asc' }, { points: 'desc' }],
      take: 10,
    });

    const badges = JSON.parse(gamificationRecord.badges || '[]') as string[];
    const gamification = {
      ...gamificationRecord,
      badges,
    };

    const leaderboard = leaderboardRows.map((row) => ({
      id: row.userId,
      points: row.points,
      rank: row.rank,
      period: row.period,
    }));

    // Get badge details
    const userBadges = badges
      .map((badgeId) => ({
        id: badgeId,
        ...(badgeInfo[badgeId] || { name: badgeId, nameEn: badgeId, icon: 'award', color: 'from-gray-400 to-gray-500' }),
      }));

    return NextResponse.json({
      success: true,
      gamification,
      skills,
      leaderboard,
      badges: userBadges,
      userId,
    });
  } catch (error) {
    console.error('Gamification GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
