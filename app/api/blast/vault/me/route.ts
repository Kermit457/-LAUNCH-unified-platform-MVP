import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateVault } from '@/lib/appwrite/services/blast-vault'

// GET /api/blast/vault/me - Get current user's vault
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required',
      }, { status: 400 })
    }

    const vault = await getOrCreateVault(userId)

    return NextResponse.json({
      success: true,
      vault,
    })

  } catch (error) {
    console.error('Get vault error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vault',
    }, { status: 500 })
  }
}
