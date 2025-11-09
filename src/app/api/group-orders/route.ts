import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { groupOrders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creatorId, groupName } = body;

    // Validate required fields
    if (!creatorId) {
      return NextResponse.json({ 
        error: "creatorId is required",
        code: "MISSING_CREATOR_ID" 
      }, { status: 400 });
    }

    if (!groupName) {
      return NextResponse.json({ 
        error: "groupName is required",
        code: "MISSING_GROUP_NAME" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedCreatorId = creatorId.toString().trim();
    const sanitizedGroupName = groupName.toString().trim();

    if (sanitizedGroupName.length === 0) {
      return NextResponse.json({ 
        error: "groupName cannot be empty",
        code: "INVALID_GROUP_NAME" 
      }, { status: 400 });
    }

    // Generate unique join code
    const generateJoinCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    let joinCode = generateJoinCode();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure join code is unique
    while (!isUnique && attempts < maxAttempts) {
      const existing = await db.select()
        .from(groupOrders)
        .where(eq(groupOrders.joinCode, joinCode))
        .limit(1);

      if (existing.length === 0) {
        isUnique = true;
      } else {
        joinCode = generateJoinCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json({ 
        error: "Unable to generate unique join code",
        code: "JOIN_CODE_GENERATION_FAILED" 
      }, { status: 500 });
    }

    // Create new group order
    const newGroupOrder = await db.insert(groupOrders)
      .values({
        joinCode,
        creatorId: sanitizedCreatorId,
        groupName: sanitizedGroupName,
        status: 'active',
        totalAmount: 0,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newGroupOrder[0], { status: 201 });

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
    const code = searchParams.get('code');

    // Validate code parameter
    if (!code) {
      return NextResponse.json({ 
        error: "code parameter is required",
        code: "MISSING_CODE" 
      }, { status: 400 });
    }

    const sanitizedCode = code.trim().toUpperCase();

    if (sanitizedCode.length === 0) {
      return NextResponse.json({ 
        error: "code cannot be empty",
        code: "INVALID_CODE" 
      }, { status: 400 });
    }

    // Find group order by join code
    const groupOrder = await db.select()
      .from(groupOrders)
      .where(eq(groupOrders.joinCode, sanitizedCode))
      .limit(1);

    if (groupOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Group order not found',
        code: "GROUP_ORDER_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(groupOrder[0], { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate id parameter
    if (!id) {
      return NextResponse.json({ 
        error: "id parameter is required",
        code: "MISSING_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const groupOrderId = parseInt(id);

    // Check if group order exists
    const existingGroupOrder = await db.select()
      .from(groupOrders)
      .where(eq(groupOrders.id, groupOrderId))
      .limit(1);

    if (existingGroupOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Group order not found',
        code: "GROUP_ORDER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Update status to completed
    const updatedGroupOrder = await db.update(groupOrders)
      .set({
        status: 'completed'
      })
      .where(eq(groupOrders.id, groupOrderId))
      .returning();

    return NextResponse.json(updatedGroupOrder[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}