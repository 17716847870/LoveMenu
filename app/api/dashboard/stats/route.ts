import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    interactionsToday: 12,
    pointsToday: 85,
    priorityOrders: 2,
    newFeedback: 3,
    newWishlist: 5,
    interactionsTrend: 'up',
    pointsTrend: 'up',
    priorityTrend: 'down',
    feedbackTrend: 'up',
    wishlistTrend: 'up',
  });
}
