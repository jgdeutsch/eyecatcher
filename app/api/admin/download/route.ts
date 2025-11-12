import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const topicName = searchParams.get('topic')
    
    // Build query
    const where = topicName ? { topicName } : {}
    
    // Get all results
    const results = await prisma.gameResult.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Convert to CSV
    const headers = [
      'ID',
      'Created At',
      'User ID (Cookie)',
      'User Name',
      'Event Type',
      'Topic Name',
      'Image URL',
      'Value',
    ]
    
    const csvRows = [
      headers.join(','),
      ...results.map(r => [
        r.id,
        r.createdAt.toISOString(),
        r.userId,
        `"${r.userName}"`, // Quote in case of commas
        r.eventType,
        `"${r.topicName}"`,
        `"${r.imageUrl}"`,
        r.value,
      ].join(',')),
    ]
    
    const csv = csvRows.join('\n')
    
    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="eyecatcher-results-${topicName || 'all'}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error downloading data:', error)
    return NextResponse.json({ error: 'Failed to download data' }, { status: 500 })
  }
}

