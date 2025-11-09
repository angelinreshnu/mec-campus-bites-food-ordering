import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodPosts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, imageUrl, caption, hashtags } = body;

    // Validate required fields
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

    if (!imageUrl) {
      return NextResponse.json({ 
        error: "Image URL is required",
        code: "MISSING_IMAGE_URL" 
      }, { status: 400 });
    }

    if (!caption) {
      return NextResponse.json({ 
        error: "Caption is required",
        code: "MISSING_CAPTION" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedUserId = userId.toString().trim();
    const sanitizedUserName = userName.toString().trim();
    const sanitizedImageUrl = imageUrl.toString().trim();
    const sanitizedCaption = caption.toString().trim();
    const sanitizedHashtags = hashtags ? hashtags.toString().trim() : null;

    // Create new food post
    const newPost = await db.insert(foodPosts)
      .values({
        userId: sanitizedUserId,
        userName: sanitizedUserName,
        imageUrl: sanitizedImageUrl,
        caption: sanitizedCaption,
        hashtags: sanitizedHashtags,
        likesCount: 0,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse pagination parameters with limits
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ 
        error: "Invalid limit parameter",
        code: "INVALID_LIMIT" 
      }, { status: 400 });
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: "Invalid offset parameter",
        code: "INVALID_OFFSET" 
      }, { status: 400 });
    }

    // Fetch food posts ordered by most recent first
    const posts = await db.select()
      .from(foodPosts)
      .orderBy(desc(foodPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}