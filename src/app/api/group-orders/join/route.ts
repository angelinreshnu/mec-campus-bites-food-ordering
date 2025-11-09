import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { groupOrders, groupOrderParticipants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { joinCode, userId, userName, orderItems, amount } = body;

    // Validate required fields
    if (!joinCode) {
      return NextResponse.json({ 
        error: "Join code is required",
        code: "MISSING_JOIN_CODE" 
      }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!userName) {
      return NextResponse.json({ 
        error: "User name is required",
        code: "MISSING_USER_NAME" 
      }, { status: 400 });
    }

    if (!orderItems) {
      return NextResponse.json({ 
        error: "Order items are required",
        code: "MISSING_ORDER_ITEMS" 
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ 
        error: "Amount is required",
        code: "MISSING_AMOUNT" 
      }, { status: 400 });
    }

    // Validate amount is positive
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    // Validate orderItems is valid JSON array
    if (!Array.isArray(orderItems)) {
      return NextResponse.json({ 
        error: "Order items must be a valid JSON array",
        code: "INVALID_ORDER_ITEMS" 
      }, { status: 400 });
    }

    // Find group order by joinCode
    const groupOrder = await db.select()
      .from(groupOrders)
      .where(eq(groupOrders.joinCode, joinCode))
      .limit(1);

    if (groupOrder.length === 0) {
      return NextResponse.json({ 
        error: "Group order not found",
        code: "GROUP_ORDER_NOT_FOUND" 
      }, { status: 404 });
    }

    const order = groupOrder[0];

    // Verify group order is active
    if (order.status !== 'active') {
      return NextResponse.json({ 
        error: "Group order is already completed",
        code: "GROUP_ORDER_COMPLETED" 
      }, { status: 400 });
    }

    // Add participant to group_order_participants table
    const newParticipant = await db.insert(groupOrderParticipants)
      .values({
        groupOrderId: order.id,
        userId: userId,
        userName: userName,
        orderItems: orderItems,
        amount: amount
      })
      .returning();

    // Update group order totalAmount by adding participant's amount
    const updatedGroupOrder = await db.update(groupOrders)
      .set({
        totalAmount: order.totalAmount + amount
      })
      .where(eq(groupOrders.id, order.id))
      .returning();

    // Return participant details with group order info
    return NextResponse.json({
      participant: newParticipant[0],
      groupOrder: updatedGroupOrder[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const groupOrderId = searchParams.get('groupOrderId');

    // Validate groupOrderId is provided
    if (!groupOrderId) {
      return NextResponse.json({ 
        error: "Group order ID is required",
        code: "MISSING_GROUP_ORDER_ID" 
      }, { status: 400 });
    }

    // Validate groupOrderId is valid integer
    const parsedGroupOrderId = parseInt(groupOrderId);
    if (isNaN(parsedGroupOrderId)) {
      return NextResponse.json({ 
        error: "Valid group order ID is required",
        code: "INVALID_GROUP_ORDER_ID" 
      }, { status: 400 });
    }

    // Get all participants for the group order
    const participants = await db.select()
      .from(groupOrderParticipants)
      .where(eq(groupOrderParticipants.groupOrderId, parsedGroupOrderId));

    return NextResponse.json(participants, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}