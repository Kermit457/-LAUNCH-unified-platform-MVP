import { NextResponse } from 'next/server'
import { serverDatabases, DB_ID, COLLECTIONS } from '@/lib/appwrite/server-client'
import { Query } from 'node-appwrite'

export async function GET() {
  try {
    const response = await serverDatabases.listDocuments(
      DB_ID,
      COLLECTIONS.CURVES,
      [Query.limit(25)]
    )

    return NextResponse.json({
      success: true,
      count: response.documents.length,
      curves: response.documents.map(c => ({
        id: c.$id,
        ownerType: c.ownerType,
        ownerId: c.ownerId,
        state: c.state,
        supply: c.supply,
        price: c.price,
        reserve: c.reserve,
      }))
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list curves', details: String(error) },
      { status: 500 }
    )
  }
}
