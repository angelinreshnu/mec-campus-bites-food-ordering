import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { classSchedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

function validateTimeFormat(time: string): boolean {
  return TIME_REGEX.test(time);
}

function validateDayOfWeek(day: string): boolean {
  return VALID_DAYS.includes(day);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, dayOfWeek, startTime, endTime, className } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!dayOfWeek) {
      return NextResponse.json({ 
        error: "dayOfWeek is required",
        code: "MISSING_DAY_OF_WEEK" 
      }, { status: 400 });
    }

    if (!startTime) {
      return NextResponse.json({ 
        error: "startTime is required",
        code: "MISSING_START_TIME" 
      }, { status: 400 });
    }

    if (!endTime) {
      return NextResponse.json({ 
        error: "endTime is required",
        code: "MISSING_END_TIME" 
      }, { status: 400 });
    }

    if (!className) {
      return NextResponse.json({ 
        error: "className is required",
        code: "MISSING_CLASS_NAME" 
      }, { status: 400 });
    }

    // Validate dayOfWeek
    if (!validateDayOfWeek(dayOfWeek)) {
      return NextResponse.json({ 
        error: "dayOfWeek must be one of: " + VALID_DAYS.join(', '),
        code: "INVALID_DAY_OF_WEEK" 
      }, { status: 400 });
    }

    // Validate time formats
    if (!validateTimeFormat(startTime)) {
      return NextResponse.json({ 
        error: "startTime must be in HH:MM format",
        code: "INVALID_START_TIME_FORMAT" 
      }, { status: 400 });
    }

    if (!validateTimeFormat(endTime)) {
      return NextResponse.json({ 
        error: "endTime must be in HH:MM format",
        code: "INVALID_END_TIME_FORMAT" 
      }, { status: 400 });
    }

    // Create new class schedule
    const newSchedule = await db.insert(classSchedules)
      .values({
        userId: userId.toString().trim(),
        dayOfWeek: dayOfWeek.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        className: className.trim(),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newSchedule[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json({ 
        error: "userId query parameter is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    // Get all schedules for the user
    const schedules = await db.select()
      .from(classSchedules)
      .where(eq(classSchedules.userId, userId));

    return NextResponse.json(schedules, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate id is provided
    if (!id) {
      return NextResponse.json({ 
        error: "id query parameter is required",
        code: "MISSING_ID" 
      }, { status: 400 });
    }

    // Validate id is a valid integer
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Delete the schedule
    const deleted = await db.delete(classSchedules)
      .where(eq(classSchedules.id, parseInt(id)))
      .returning();

    // Check if schedule was found and deleted
    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: "Schedule not found",
        code: "SCHEDULE_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Schedule deleted successfully",
      deletedSchedule: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}