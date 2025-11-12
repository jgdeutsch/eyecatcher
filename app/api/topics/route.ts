import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    // Read the CSV file from the public directory
    const filePath = join(process.cwd(), 'public', 'topics.csv')
    const fileContent = await readFile(filePath, 'utf-8')
    
    // Parse CSV (skip header row)
    const lines = fileContent.trim().split('\n').slice(1)
    
    // Group images by topic
    const topicsMap = new Map<string, string[]>()
    
    for (const line of lines) {
      // Simple CSV parsing (works for this use case)
      const [topicName, imageUrl] = line.split(',').map(s => s.trim())
      
      if (!topicsMap.has(topicName)) {
        topicsMap.set(topicName, [])
      }
      topicsMap.get(topicName)!.push(imageUrl)
    }
    
    // Convert to array format
    const topics = Array.from(topicsMap.entries()).map(([name, images]) => ({
      name,
      images,
    }))
    
    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Error reading topics:', error)
    return NextResponse.json(
      { error: 'Failed to load topics' },
      { status: 500 }
    )
  }
}

