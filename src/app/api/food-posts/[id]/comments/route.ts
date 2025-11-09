import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodPosts, postComments } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Verify post exists
    const post = await db.select()
      .from(foodPosts)
      .where(eq(foodPosts.id, parseInt(postId)))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get comments for the post
    const comments = await db.select()
      .from(postComments)
      .where(eq(postComments.postId, parseInt(postId)))
      .orderBy(asc(postComments.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('GET comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId, userName, comment } = body;

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

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required', code: 'MISSING_COMMENT' },
        { status: 400 }
      );
    }

    // Validate comment is not empty after trimming
    const trimmedComment = comment.trim();
    if (trimmedComment.length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty', code: 'EMPTY_COMMENT' },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await db.select()
      .from(foodPosts)
      .where(eq(foodPosts.id, parseInt(postId)))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Create comment
    const newComment = await db.insert(postComments)
      .values({
        postId: parseInt(postId),
        userId: userId.trim(),
        userName: userName.trim(),
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error('POST comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}