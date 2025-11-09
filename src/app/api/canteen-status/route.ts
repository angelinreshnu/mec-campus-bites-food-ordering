import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { canteenStatus } from '@/db/schema';
import { desc } from 'drizzle-orm';

const VALID_CROWD_LEVELS = ['Low', 'Medium', 'High'];

export async function GET(request: NextRequest) {
  try {
    const status = await db.select()
      .from(canteenStatus)
      .orderBy(desc(canteenStatus.lastUpdated))
      .limit(1);

    if (status.length === 0) {
      return NextResponse.json({
        currentCrowdLevel: 'Medium',
        lastUpdated: new Date().toISOString()
      }, { status: 200 });
    }

    return NextResponse.json(status[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentCrowdLevel } = body;

    if (!currentCrowdLevel) {
      return NextResponse.json({ 
        error: "Current crowd level is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!VALID_CROWD_LEVELS.includes(currentCrowdLevel)) {
      return NextResponse.json({ 
        error: "Invalid crowd level. Must be 'Low', 'Medium', or 'High'",
        code: "INVALID_CROWD_LEVEL" 
      }, { status: 400 });
    }

    const newStatus = await db.insert(canteenStatus)
      .values({
        currentCrowdLevel: currentCrowdLevel.trim(),
        lastUpdated: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newStatus[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}