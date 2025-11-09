import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { preOrders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, orderItems, pickupTime } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!orderItems) {
      return NextResponse.json({ 
        error: "orderItems is required",
        code: "MISSING_ORDER_ITEMS" 
      }, { status: 400 });
    }

    if (!pickupTime) {
      return NextResponse.json({ 
        error: "pickupTime is required",
        code: "MISSING_PICKUP_TIME" 
      }, { status: 400 });
    }

    // Validate orderItems is an array
    if (!Array.isArray(orderItems)) {
      return NextResponse.json({ 
        error: "orderItems must be an array",
        code: "INVALID_ORDER_ITEMS_FORMAT" 
      }, { status: 400 });
    }

    // Validate orderItems array is not empty
    if (orderItems.length === 0) {
      return NextResponse.json({ 
        error: "orderItems cannot be empty",
        code: "EMPTY_ORDER_ITEMS" 
      }, { status: 400 });
    }

    // Validate each order item has required fields
    for (const item of orderItems) {
      if (!item.menuItemId || !item.menuItemName || !item.quantity || !item.price) {
        return NextResponse.json({ 
          error: "Each order item must have menuItemId, menuItemName, quantity, and price",
          code: "INVALID_ORDER_ITEM_STRUCTURE" 
        }, { status: 400 });
      }
    }

    // Create new pre-order
    const newPreOrder = await db.insert(preOrders)
      .values({
        userId: userId.trim(),
        orderItems: orderItems,
        pickupTime: pickupTime.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newPreOrder[0], { status: 201 });
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

    // Get all pre-orders for the user, ordered by most recent first
    const userPreOrders = await db.select()
      .from(preOrders)
      .where(eq(preOrders.userId, userId))
      .orderBy(desc(preOrders.createdAt));

    return NextResponse.json(userPreOrders, { status: 200 });
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

    // Validate ID is provided and valid
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid id query parameter is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status is provided
    if (!status) {
      return NextResponse.json({ 
        error: "status is required",
        code: "MISSING_STATUS" 
      }, { status: 400 });
    }

    // Validate status is one of the allowed values
    const validStatuses = ['pending', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "status must be one of: pending, ready, completed",
        code: "INVALID_STATUS_VALUE" 
      }, { status: 400 });
    }

    // Check if pre-order exists
    const existingPreOrder = await db.select()
      .from(preOrders)
      .where(eq(preOrders.id, parseInt(id)))
      .limit(1);

    if (existingPreOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Pre-order not found',
        code: 'PRE_ORDER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Update the pre-order status
    const updatedPreOrder = await db.update(preOrders)
      .set({
        status: status
      })
      .where(eq(preOrders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedPreOrder[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}