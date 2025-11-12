'use client'

import { useState, useEffect } from 'react'
import Welcome from './Welcome'
import Instructions from './Instructions'
import TopicCountdown from './TopicCountdown'
import ClickTest from './ClickTest'
import RankTest from './RankTest'
import Thanks from './Thanks'

interface Topic {
  name: string
  images: string[]
}

type GameState = 'welcome' | 'instructions' | 'topicCountdown' | 'clickTest' | 'rankTest' | 'thanks'

export default function GameFlow() {
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [gameState, setGameState] = useState<GameState>('welcome')
  const [isLoading, setIsLoading] = useState(true)
  const [clickedImagesForCurrentTopic, setClickedImagesForCurrentTopic] = useState<string[]>([])

  // Initialize userId and load topics
  useEffect(() => {
    // Get or create userId from localStorage
    let id = localStorage.getItem('eyecatcher_userId')
    if (!id) {
      // Generate a simple unique ID
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('eyecatcher_userId', id)
    }
    setUserId(id)

    // Fetch topics from API
    fetch('/api/topics')
      .then((res) => res.json())
      .then((data) => {
        setTopics(data.topics)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching topics:', error)
        setIsLoading(false)
      })
  }, [])

  // Helper function to log events to the API
  const logEvent = async (data: {
    eventType: string
    topicName: string
    imageUrl: string
    value: number
  }) => {
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          ...data,
        }),
      })
    } catch (error) {
      console.error('Error logging event:', error)
    }
  }

  // Handle state transitions
  const handleWelcomeComplete = (name: string) => {
    setUserName(name)
    setGameState('instructions')
  }

  const handleInstructionsComplete = () => {
    setGameState('topicCountdown')
  }

  const handleCountdownComplete = () => {
    setGameState('clickTest')
  }

  const handleClickTestComplete = (clickedImages: string[]) => {
    setClickedImagesForCurrentTopic(clickedImages)
    setGameState('rankTest')
  }

  const handleRankTestComplete = () => {
    // Move to next topic or finish
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1)
      setClickedImagesForCurrentTopic([]) // Reset for next topic
      setGameState('topicCountdown') // Show countdown before next topic
    } else {
      setGameState('thanks')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Error state - no topics
  if (topics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Topics
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Unable to load the game data. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  const currentTopic = topics[currentTopicIndex]

  // Render current game state
  switch (gameState) {
    case 'welcome':
      return <Welcome onStart={handleWelcomeComplete} />
    
    case 'instructions':
      return <Instructions onReady={handleInstructionsComplete} />
    
    case 'topicCountdown':
      return (
        <TopicCountdown
          topic={currentTopic}
          onComplete={handleCountdownComplete}
        />
      )
    
    case 'clickTest':
      return (
        <ClickTest
          topic={currentTopic}
          onComplete={handleClickTestComplete}
          logEvent={logEvent}
        />
      )
    
    case 'rankTest':
      return (
        <RankTest
          topic={currentTopic}
          clickedImages={clickedImagesForCurrentTopic}
          onComplete={handleRankTestComplete}
          logEvent={logEvent}
        />
      )
    
    case 'thanks':
      return <Thanks />
    
    default:
      return null
  }
}

