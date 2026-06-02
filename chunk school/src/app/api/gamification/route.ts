import { NextRequest, NextResponse } from 'next/server';
import { mockGamification, mockSkills, mockLeaderboard, badgeInfo } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 's1';

    // Get gamification data for user
    const gamification = mockGamification.userId === userId
      ? mockGamification
      : {
          ...mockGamification,
          id: `g_${userId}`,
          userId,
          points: 1200,
          level: 6,
          streak: 3,
          badges: ['first_enrollment'],
          rank: 8,
        };

    // Get skills for user
    const skills = mockSkills.filter((s) => s.userId === userId);

    // Get leaderboard
    const leaderboard = mockLeaderboard;

    // Get badge details
    const userBadges = gamification.badges
      .map((badgeId) => ({
        id: badgeId,
        ...(badgeInfo[badgeId] || { name: badgeId, nameEn: badgeId, icon: '🏅', color: 'from-gray-400 to-gray-500' }),
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
