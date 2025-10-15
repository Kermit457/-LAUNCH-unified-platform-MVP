import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DB_ID, COLLECTIONS } from '@/lib/appwrite/server-client';
import { Query } from 'node-appwrite';

/**
 * GET /api/curve/[id]/holdings?userId=xxx
 * Get user's key holdings for a specific curve
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: curveId } = params;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Query the curve_holders collection
    const holders = await serverDatabases.listDocuments(
      DB_ID,
      COLLECTIONS.CURVE_HOLDERS,
      [
        Query.equal('curveId', curveId),
        Query.equal('userId', userId),
        Query.limit(1),
      ]
    );

    if (holders.documents.length === 0) {
      // User doesn't own any keys
      return NextResponse.json({
        curveId,
        userId,
        balance: 0,
        avgPrice: 0,
        totalInvested: 0,
      });
    }

    const holder = holders.documents[0];

    return NextResponse.json({
      curveId,
      userId,
      balance: holder.balance || 0,
      avgPrice: holder.avgPrice || 0,
      totalInvested: holder.totalInvested || 0,
      realizedPnl: holder.realizedPnl || 0,
      unrealizedPnl: holder.unrealizedPnl || 0,
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holdings', details: String(error) },
      { status: 500 }
    );
  }
}
