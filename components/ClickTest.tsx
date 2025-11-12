'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Topic {
  name: string
  images: string[]
}

interface ClickTestProps {
  topic: Topic
  onComplete: (clickedImages: string[]) => void
  logEvent: (data: {
    eventType: string
    topicName: string
    imageUrl: string
    value: number
  }) => Promise<void>
}

export default function ClickTest({ topic, onComplete, logEvent }: ClickTestProps) {
  const [timeRemaining, setTimeRemaining] = useState(10)
  const [clickedImages, setClickedImages] = useState<Set<string>>(new Set())
  const [shuffledImages, setShuffledImages] = useState<string[]>([])

  // Shuffle images and log LOAD events on mount
  useEffect(() => {
    // Shuffle the images for random display
    const shuffled = [...topic.images].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)

    // Log LOAD event for each image with its position
    shuffled.forEach((imageUrl, index) => {
      logEvent({
        eventType: 'LOAD',
        topicName: topic.name,
        imageUrl,
        value: index, // position in the grid
      })
    })
  }, [topic, logEvent])

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Pass the clicked images to the parent
      onComplete(Array.from(clickedImages))
      return
    }

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeRemaining, onComplete, clickedImages])

  const handleImageClick = async (imageUrl: string) => {
    const newClickedImages = new Set(clickedImages)
    const isNowClicked = !clickedImages.has(imageUrl)
    
    if (isNowClicked) {
      newClickedImages.add(imageUrl)
    } else {
      newClickedImages.delete(imageUrl)
    }
    
    setClickedImages(newClickedImages)

    // Log CLICK event
    await logEvent({
      eventType: 'CLICK',
      topicName: topic.name,
      imageUrl,
      value: isNowClicked ? 1 : 0, // 1 for click, 0 for unclick
    })
  }

  // Calculate progress percentage
  const progressPercentage = ((10 - timeRemaining) / 10) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with topic and timer */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
            Topic: {topic.name}
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Click the images that catch your eye!
              </span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {timeRemaining}s
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Image grid - responsive sizing */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {shuffledImages.map((imageUrl, index) => (
            <button
              key={`${imageUrl}-${index}`}
              onClick={() => handleImageClick(imageUrl)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${
                clickedImages.has(imageUrl)
                  ? 'ring-4 ring-blue-500 shadow-xl scale-95'
                  : 'ring-2 ring-gray-300 hover:ring-gray-400'
              }`}
            >
              <Image
                src={imageUrl}
                alt={`${topic.name} image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                className="object-cover"
              />
              
              {/* Checkmark overlay for clicked images */}
              {clickedImages.has(imageUrl) && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl font-bold">
                    ✓
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

