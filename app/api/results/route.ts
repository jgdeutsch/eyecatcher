import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, eventType, topicName, imageUrl, value, position } = body
    
    // Validate required fields
    if (!userId || !userName || !eventType || !topicName || !imageUrl || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create new game result entry
    const result = await prisma.gameResult.create({
      data: {
        userId,
        userName,
        eventType,
        topicName,
        imageUrl,
        value: parseInt(value),
        position: position !== undefined ? parseInt(position) : null,
      },
    })
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error saving result:', error)
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    )
  }
}

