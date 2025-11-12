'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Topic {
  name: string
  images: string[]
}

interface TopicCountdownProps {
  topic: Topic
  onComplete: () => void
}

export default function TopicCountdown({ topic, onComplete }: TopicCountdownProps) {
  const [countdown, setCountdown] = useState(3)

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, onComplete])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hidden images for preloading */}
        <div className="hidden">
          {topic.images.map((imageUrl, index) => (
            <Image
              key={`preload-${index}`}
              src={imageUrl}
              alt={`Preload ${index}`}
              width={400}
              height={400}
              priority
            />
          ))}
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-6">
            Google Shopping images for:
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-12">
            {topic.name}
          </h1>
          
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
              Starting in
            </p>
            
            {/* Animated countdown number */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-900 animate-ping opacity-75"></div>
              <div className="relative w-28 h-28 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-2xl">
                <span className="text-6xl font-bold text-white">
                  {countdown}
                </span>
              </div>
            </div>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-6">
              seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

