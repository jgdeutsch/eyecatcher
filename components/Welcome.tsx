'use client'

import { useState } from 'react'

interface WelcomeProps {
  onStart: (name: string) => void
}

export default function Welcome({ onStart }: WelcomeProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      setError('Please enter your name to continue')
      return
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    
    onStart(trimmedName)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Google Shopping Eye Catcher
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Help us discover what product images perform best!
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          This research will tell us what types of product images get the highest clickthrough rate and conversion in Google Shopping.
        </p>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
          In this study, we'll show you different product topics and images. Your task is to select images that catch your eye and then rank them by preference.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-500 mb-8">
          This should take approximately 5-10 minutes to complete.
        </p>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Please enter your name to begin:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your name"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  )
}

