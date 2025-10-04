import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/predictions/:id/export - Export winners as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: params.id },
      include: {
        votes: true,
      },
    })

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    if (prediction.state !== 'SETTLED' || !prediction.winningOption) {
      return NextResponse.json(
        { error: 'Prediction must be settled to export winners' },
        { status: 400 }
      )
    }

    // Filter winners
    const winners = prediction.votes.filter(
      (vote) => vote.option === prediction.winningOption
    )

    // Generate CSV
    const csvHeader = 'user_id,option,weight\n'
    const csvRows = winners
      .map((vote) => `${vote.userId},${vote.option},${vote.weight}`)
      .join('\n')
    const csv = csvHeader + csvRows

    // Return as downloadable file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="prediction_${params.id}_winners.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting winners:', error)
    return NextResponse.json(
      { error: 'Failed to export winners' },
      { status: 500 }
    )
  }
}
