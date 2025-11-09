import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userStats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, orderAmount } = await request.json();

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!userName) {
      return NextResponse.json(
        { error: 'userName is required', code: 'MISSING_USER_NAME' },
        { status: 400 }
      );
    }

    if (orderAmount === undefined || orderAmount === null) {
      return NextResponse.json(
        { error: 'orderAmount is required', code: 'MISSING_ORDER_AMOUNT' },
        { status: 400 }
      );
    }

    if (typeof orderAmount !== 'number' || orderAmount < 0) {
      return NextResponse.json(
        { error: 'orderAmount must be a non-negative number', code: 'INVALID_ORDER_AMOUNT' },
        { status: 400 }
      );
    }

    // Find existing user stats
    const existingStats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    const now = new Date().toISOString();

    if (existingStats.length === 0) {
      // Create new stats record with first order
      const newTotalOrders = 1;
      const newTotalSpent = orderAmount;

      // Assign badges based on milestones
      const badges: string[] = [];
      if (newTotalOrders === 1) {
        badges.push('First Order');
      }
      if (newTotalOrders >= 10) {
        badges.push('Regular Customer');
      }
      if (newTotalSpent >= 1000) {
        badges.push('VIP Member');
      }
      if (newTotalSpent >= 5000) {
        badges.push('Big Spender');
      }

      const newStats = await db
        .insert(userStats)
        .values({
          userId,
          userName,
          totalOrders: newTotalOrders,
          totalSpent: newTotalSpent,
          badges: JSON.stringify(badges),
          rank: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return NextResponse.json(newStats[0], { status: 201 });
    } else {
      // Update existing stats
      const currentStats = existingStats[0];
      const newTotalOrders = currentStats.totalOrders + 1;
      const newTotalSpent = currentStats.totalSpent + orderAmount;

      // Assign badges based on milestones
      const badges: string[] = [];
      if (newTotalOrders === 1) {
        badges.push('First Order');
      }
      if (newTotalOrders >= 10) {
        badges.push('Regular Customer');
      }
      if (newTotalSpent >= 1000) {
        badges.push('VIP Member');
      }
      if (newTotalSpent >= 5000) {
        badges.push('Big Spender');
      }

      const updatedStats = await db
        .update(userStats)
        .set({
          totalOrders: newTotalOrders,
          totalSpent: newTotalSpent,
          badges: JSON.stringify(badges),
          updatedAt: now,
        })
        .where(eq(userStats.userId, userId))
        .returning();

      return NextResponse.json(updatedStats[0], { status: 200 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Validate required query parameter
    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Find user stats
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      // Create default stats record if not exists
      const now = new Date().toISOString();
      const defaultStats = await db
        .insert(userStats)
        .values({
          userId,
          userName: 'User',
          totalOrders: 0,
          totalSpent: 0,
          badges: JSON.stringify([]),
          rank: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return NextResponse.json(defaultStats[0], { status: 200 });
    }

    return NextResponse.json(stats[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}