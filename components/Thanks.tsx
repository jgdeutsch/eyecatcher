export default function Thanks() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            Thank You!
          </h1>
        </div>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          You've completed the Eye Catcher study!
        </p>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Your responses have been recorded and will help us better understand visual preferences. We appreciate your time and participation.
        </p>
        
        <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            You may now close this window.
          </p>
        </div>
      </div>
    </div>
  )
}

