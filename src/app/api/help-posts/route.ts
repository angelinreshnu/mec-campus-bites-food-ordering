import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { helpPosts } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, title, description, imageUrl, category } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!userName) {
      return NextResponse.json(
        { error: 'User name is required', code: 'MISSING_USER_NAME' },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['Lost', 'Found', 'Help'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: `Category must be one of: ${validCategories.join(', ')}`,
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    // Create new help post
    const newHelpPost = await db
      .insert(helpPosts)
      .values({
        userId: userId.trim(),
        userName: userName.trim(),
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl?.trim() || null,
        category,
        status: 'active',
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newHelpPost[0], { status: 201 });
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
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate status if provided
    const validStatuses = ['active', 'resolved'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Status must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate category if provided
    const validCategories = ['Lost', 'Found', 'Help'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: `Category must be one of: ${validCategories.join(', ')}`,
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    // Build query with filters
    let query = db.select().from(helpPosts);

    // Apply filters
    const conditions = [];
    if (status) {
      conditions.push(eq(helpPosts.status, status));
    }
    if (category) {
      conditions.push(eq(helpPosts.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply ordering and pagination
    const results = await query
      .orderBy(desc(helpPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status field
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    const validStatuses = ['active', 'resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Status must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if help post exists
    const existingPost = await db
      .select()
      .from(helpPosts)
      .where(eq(helpPosts.id, parseInt(id)))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Help post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update help post status
    const updatedPost = await db
      .update(helpPosts)
      .set({
        status,
      })
      .where(eq(helpPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedPost[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}