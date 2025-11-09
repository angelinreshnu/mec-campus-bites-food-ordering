import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wallets, walletTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, description } = body;

    // Validation: Check required fields
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { 
          error: 'Amount is required',
          code: 'MISSING_AMOUNT' 
        },
        { status: 400 }
      );
    }

    // Validation: Amount must be positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { 
          error: 'Amount must be a positive number',
          code: 'INVALID_AMOUNT' 
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const transactionDescription = description || 'Wallet top-up';

    // Step 1: Find or create wallet for userId
    let existingWallet = await db.select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    let wallet;
    let walletId;

    if (existingWallet.length === 0) {
      // Create new wallet
      const newWallet = await db.insert(wallets)
        .values({
          userId,
          balance: parsedAmount,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      wallet = newWallet[0];
      walletId = wallet.id;
    } else {
      // Update existing wallet
      const currentWallet = existingWallet[0];
      const newBalance = currentWallet.balance + parsedAmount;

      const updatedWallet = await db.update(wallets)
        .set({
          balance: newBalance,
          updatedAt: now,
        })
        .where(eq(wallets.id, currentWallet.id))
        .returning();

      wallet = updatedWallet[0];
      walletId = wallet.id;
    }

    // Step 4: Create transaction record with type 'credit'
    const transaction = await db.insert(walletTransactions)
      .values({
        walletId,
        userId,
        amount: parsedAmount,
        transactionType: 'credit',
        description: transactionDescription,
        createdAt: now,
      })
      .returning();

    // Step 5: Return updated wallet with new balance and transaction details
    return NextResponse.json(
      {
        wallet: {
          id: wallet.id,
          userId: wallet.userId,
          balance: wallet.balance,
          updatedAt: wallet.updatedAt,
        },
        transaction: {
          id: transaction[0].id,
          amount: transaction[0].amount,
          transactionType: transaction[0].transactionType,
          description: transaction[0].description,
          createdAt: transaction[0].createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/wallet/add-money error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}