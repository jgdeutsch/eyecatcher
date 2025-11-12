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
    
    // Get all unique topic names from the database
    const topics = await prisma.gameResult.findMany({
      select: {
        topicName: true,
      },
      distinct: ['topicName'],
      orderBy: {
        topicName: 'asc',
      },
    })
    
    const topicNames = topics.map(t => t.topicName)
    
    return NextResponse.json({ topics: topicNames })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}

