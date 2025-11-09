import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userStats } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ 
        error: 'Invalid limit parameter',
        code: 'INVALID_LIMIT' 
      }, { status: 400 });
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: 'Invalid offset parameter',
        code: 'INVALID_OFFSET' 
      }, { status: 400 });
    }

    // Fetch all user stats ordered by totalSpent DESC to calculate ranks
    const allStats = await db.select()
      .from(userStats)
      .orderBy(desc(userStats.totalSpent));

    // Calculate ranks based on totalSpent
    const rankedStats = allStats.map((stat, index) => ({
      ...stat,
      rank: index + 1
    }));

    // Apply pagination
    const paginatedStats = rankedStats.slice(offset, offset + limit);

    return NextResponse.json(paginatedStats, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}