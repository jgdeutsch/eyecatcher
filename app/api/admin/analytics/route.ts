import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    
    if (!topicName) {
      return NextResponse.json({ error: 'Topic name required' }, { status: 400 })
    }
    
    // Get all results for this topic
    const results = await prisma.gameResult.findMany({
      where: {
        topicName,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Calculate analytics
    const clickEvents = results.filter(r => r.eventType === 'CLICK' && r.value === 1)
    const rankEvents = results.filter(r => r.eventType === 'RANK')
    
    // Count clicks per image
    const clickCounts: Record<string, number> = {}
    clickEvents.forEach(event => {
      clickCounts[event.imageUrl] = (clickCounts[event.imageUrl] || 0) + 1
    })
    
    // Calculate average rank per image (lower is better)
    const rankSums: Record<string, number> = {}
    const rankCounts: Record<string, number> = {}
    rankEvents.forEach(event => {
      rankSums[event.imageUrl] = (rankSums[event.imageUrl] || 0) + event.value
      rankCounts[event.imageUrl] = (rankCounts[event.imageUrl] || 0) + 1
    })
    
    const averageRanks: Record<string, number> = {}
    Object.keys(rankSums).forEach(url => {
      averageRanks[url] = rankSums[url] / rankCounts[url]
    })
    
    // Calculate average position for clicked images
    const positionSums: Record<string, number> = {}
    const positionCounts: Record<string, number> = {}
    
    clickEvents.forEach(event => {
      if (event.position !== null && event.position !== undefined) {
        positionSums[event.imageUrl] = (positionSums[event.imageUrl] || 0) + event.position
        positionCounts[event.imageUrl] = (positionCounts[event.imageUrl] || 0) + 1
      }
    })
    
    const averagePositions: Record<string, number> = {}
    Object.keys(positionSums).forEach(url => {
      averagePositions[url] = positionSums[url] / positionCounts[url]
    })
    
    // Combine data
    const imageStats = Object.keys(clickCounts).map(imageUrl => ({
      imageUrl,
      clicks: clickCounts[imageUrl] || 0,
      averageRank: averageRanks[imageUrl] || null,
      rankCount: rankCounts[imageUrl] || 0,
      averagePosition: averagePositions[imageUrl] || null,
      positionCount: positionCounts[imageUrl] || 0,
    }))
    
    // Sort by clicks (descending)
    imageStats.sort((a, b) => b.clicks - a.clicks)
    
    // Get unique users count
    const uniqueUsers = new Set(results.map(r => r.userId)).size
    const uniqueNames = new Set(results.map(r => r.userName)).size
    
    return NextResponse.json({
      topicName,
      totalResponses: uniqueUsers,
      uniqueNames,
      totalEvents: results.length,
      imageStats,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

