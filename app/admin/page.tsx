'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ImageStat {
  imageUrl: string
  clicks: number
  averageRank: number | null
  rankCount: number
}

interface Analytics {
  topicName: string
  totalResponses: number
  uniqueNames: number
  totalEvents: number
  imageStats: ImageStat[]
}

export default function AdminDashboard() {
  const [topics, setTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    if (selectedTopic) {
      fetchAnalytics(selectedTopic)
    }
  }, [selectedTopic])

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/admin/topics')
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      const data = await response.json()
      setTopics(data.topics || [])
      
      if (data.topics && data.topics.length > 0) {
        setSelectedTopic(data.topics[0])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching topics:', error)
      setLoading(false)
    }
  }

  const fetchAnalytics = async (topic: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?topic=${encodeURIComponent(topic)}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (topic?: string) => {
    setDownloading(true)
    try {
      const url = topic 
        ? `/api/admin/download?topic=${encodeURIComponent(topic)}`
        : '/api/admin/download'
      
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `eyecatcher-results-${topic || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading data:', error)
      alert('Failed to download data')
    } finally {
      setDownloading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading && topics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Google Shopping Eye Catcher Analytics
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDownload()}
                disabled={downloading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {downloading ? 'Downloading...' : 'Download All Data'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Topic
          </label>
          <div className="flex gap-3">
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <button
              onClick={() => selectedTopic && handleDownload(selectedTopic)}
              disabled={downloading || !selectedTopic}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Download Topic Data
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Responses</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {analytics.totalResponses}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Names</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {analytics.uniqueNames}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {analytics.totalEvents}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Images Tested</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {analytics.imageStats.length}
                </p>
              </div>
            </div>

            {/* Top Images */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Image Performance Rankings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sorted by number of clicks (most to least)
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.imageStats.map((stat, index) => (
                    <div key={stat.imageUrl} className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={stat.imageUrl}
                          alt={`Image ${index + 1}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {stat.imageUrl}
                        </p>
                      </div>
                      
                      <div className="flex gap-6 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {stat.clicks}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Clicks
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {stat.averageRank ? stat.averageRank.toFixed(1) : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Avg Rank
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {stat.rankCount}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Rankings
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!analytics && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Select a topic to view analytics
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

