import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { mealPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_DIET_PREFERENCES = ['Healthy', 'High-Protein', 'Spicy', 'Any'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { 
          error: 'userId is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    const preferences = await db
      .select()
      .from(mealPreferences)
      .where(eq(mealPreferences.userId, userId))
      .limit(1);

    if (preferences.length === 0) {
      return NextResponse.json(
        { 
          error: 'Meal preferences not found for this user',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(preferences[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, budgetRange, dietPreference } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'userId is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    if (!budgetRange) {
      return NextResponse.json(
        { 
          error: 'budgetRange is required',
          code: 'MISSING_BUDGET_RANGE' 
        },
        { status: 400 }
      );
    }

    if (!dietPreference) {
      return NextResponse.json(
        { 
          error: 'dietPreference is required',
          code: 'MISSING_DIET_PREFERENCE' 
        },
        { status: 400 }
      );
    }

    // Validate dietPreference
    if (!VALID_DIET_PREFERENCES.includes(dietPreference)) {
      return NextResponse.json(
        { 
          error: `dietPreference must be one of: ${VALID_DIET_PREFERENCES.join(', ')}`,
          code: 'INVALID_DIET_PREFERENCE' 
        },
        { status: 400 }
      );
    }

    // Check if preferences already exist for this user
    const existingPreferences = await db
      .select()
      .from(mealPreferences)
      .where(eq(mealPreferences.userId, userId))
      .limit(1);

    const currentTimestamp = new Date().toISOString();

    if (existingPreferences.length > 0) {
      // Update existing preferences
      const updated = await db
        .update(mealPreferences)
        .set({
          budgetRange: budgetRange.trim(),
          dietPreference: dietPreference.trim(),
          updatedAt: currentTimestamp
        })
        .where(eq(mealPreferences.userId, userId))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // Create new preferences
      const newPreferences = await db
        .insert(mealPreferences)
        .values({
          userId: userId.trim(),
          budgetRange: budgetRange.trim(),
          dietPreference: dietPreference.trim(),
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        })
        .returning();

      return NextResponse.json(newPreferences[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}