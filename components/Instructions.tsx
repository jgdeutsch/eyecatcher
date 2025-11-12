interface InstructionsProps {
  onReady: () => void
}

export default function Instructions({ onReady }: InstructionsProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-bold mb-6 text-teal-600 dark:text-teal-400 text-center">
          How It Works
        </h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-teal-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-3 text-teal-700 dark:text-teal-300">
              Phase 1: Click Test (10 seconds)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              For each topic, you'll see a <strong>3-second countdown</strong> showing the topic name. Then, a grid of Google Shopping product images will appear. You have <strong>10 seconds</strong> to click on the images that catch your eye. Click as many as you like!
            </p>
          </div>
          
          <div className="bg-teal-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-3 text-teal-700 dark:text-teal-300">
              Phase 2: Ranking
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              After the click test, you'll see all the images again. Please <strong>drag and drop</strong> them to rank by your preference, with your favorite at the top.
            </p>
          </div>
          
          <div className="bg-amber-50 dark:bg-gray-700 p-6 rounded-lg border-2 border-amber-300">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              <strong>Note:</strong> We'll repeat this process for each topic. Just be yourself and go with your gut feeling!
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={onReady}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Ready to Start!
          </button>
        </div>
      </div>
    </div>
  )
}

