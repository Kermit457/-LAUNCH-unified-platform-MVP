import { NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID } from 'appwrite'

export async function GET() {
  try {
    // Test connection
    console.log('Testing Appwrite connection...')
    console.log('DB_ID:', DB_ID)
    console.log('CURVES Collection:', COLLECTIONS.CURVES)

    // Try to list documents
    const result = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CURVES,
      []
    )

    return NextResponse.json({
      success: true,
      message: 'Appwrite connection successful',
      database: DB_ID,
      collection: COLLECTIONS.CURVES,
      documentsCount: result.total,
      documents: result.documents
    })
  } catch (error: any) {
    console.error('Appwrite test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      code: error.code,
      type: error.type,
      database: DB_ID,
      collection: COLLECTIONS.CURVES
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Try to create a test curve
    const testCurve = {
      ownerType: 'user',
      ownerId: 'test-user-' + Date.now(),
      state: 'active',
      price: 0.01,
      reserve: 0,
      supply: 0,
      holders: 0,
      createdAt: new Date().toISOString()
    }

    console.log('Creating test curve:', testCurve)

    const document = await databases.createDocument(
      DB_ID,
      COLLECTIONS.CURVES,
      ID.unique(),
      testCurve
    )

    return NextResponse.json({
      success: true,
      message: 'Test curve created successfully',
      document
    })
  } catch (error: any) {
    console.error('Create test curve error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      code: error.code,
      type: error.type,
      details: error
    }, { status: 500 })
  }
}
