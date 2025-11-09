import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodPosts, postLikes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid post ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const postId = parseInt(id);
    
    // Parse request body
    const body = await request.json();
    const { userId } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await db.select()
      .from(foodPosts)
      .where(eq(foodPosts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { 
          error: 'Post not found',
          code: 'POST_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if user has already liked this post
    const existingLike = await db.select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json(
        { 
          error: 'Already liked',
          code: 'ALREADY_LIKED'
        },
        { status: 400 }
      );
    }

    // Create like record
    await db.insert(postLikes)
      .values({
        postId,
        userId,
        createdAt: new Date().toISOString()
      });

    // Increment likesCount in foodPosts
    const updatedPost = await db.update(foodPosts)
      .set({
        likesCount: post[0].likesCount + 1
      })
      .where(eq(foodPosts.id, postId))
      .returning();

    return NextResponse.json(updatedPost[0], { status: 201 });

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid post ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const postId = parseInt(id);
    
    // Parse request body
    const body = await request.json();
    const { userId } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await db.select()
      .from(foodPosts)
      .where(eq(foodPosts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { 
          error: 'Post not found',
          code: 'POST_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Find like record
    const existingLike = await db.select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length === 0) {
      return NextResponse.json(
        { 
          error: 'Like not found',
          code: 'LIKE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Delete like record
    await db.delete(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      );

    // Decrement likesCount in foodPosts
    const newLikesCount = Math.max(0, post[0].likesCount - 1);
    const updatedPost = await db.update(foodPosts)
      .set({
        likesCount: newLikesCount
      })
      .where(eq(foodPosts.id, postId))
      .returning();

    return NextResponse.json(updatedPost[0], { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}