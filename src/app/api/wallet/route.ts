import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Find wallet by userId
    const existingWallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    // If wallet doesn't exist, create one with balance 0
    if (existingWallet.length === 0) {
      const now = new Date().toISOString();
      const newWallet = await db
        .insert(wallets)
        .values({
          userId,
          balance: 0,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return NextResponse.json(newWallet[0], { status: 200 });
    }

    return NextResponse.json(existingWallet[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Check if wallet already exists for userId
    const existingWallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    // If exists, return existing wallet (don't create duplicate)
    if (existingWallet.length > 0) {
      return NextResponse.json(existingWallet[0], { status: 200 });
    }

    // Create new wallet with default balance 0
    const now = new Date().toISOString();
    const newWallet = await db
      .insert(wallets)
      .values({
        userId,
        balance: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newWallet[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}