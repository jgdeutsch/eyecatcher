'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Topic {
  name: string
  images: string[]
}

interface RankTestProps {
  topic: Topic
  clickedImages: string[]
  onComplete: () => void
  logEvent: (data: {
    eventType: string
    topicName: string
    imageUrl: string
    value: number
    position?: number
  }) => Promise<void>
}

function SortableImage({ id, imageUrl, index }: { id: string; imageUrl: string; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center p-3 md:p-4 gap-2 md:gap-4">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="md:w-6 md:h-6"
          >
            <line x1="8" y1="6" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="18" />
            <circle cx="8" cy="9" r="1.5" fill="currentColor" />
            <circle cx="8" cy="15" r="1.5" fill="currentColor" />
            <circle cx="16" cy="9" r="1.5" fill="currentColor" />
            <circle cx="16" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </button>

        {/* Rank number */}
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base md:text-lg">
          {index + 1}
        </div>

        {/* Image thumbnail - responsive sizing */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={`Rank ${index + 1}`}
            fill
            sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
            className="object-cover"
          />
        </div>

        {/* Spacer */}
        <div className="flex-grow" />
      </div>
    </div>
  )
}

export default function RankTest({ topic, clickedImages, onComplete, logEvent }: RankTestProps) {
  // Only show images that were clicked
  const [rankedImages, setRankedImages] = useState<string[]>(clickedImages)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setRankedImages((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleNext = async () => {
    setIsSubmitting(true)

    // Log RANK event for each image with its final position
    for (let i = 0; i < rankedImages.length; i++) {
      await logEvent({
        eventType: 'RANK',
        topicName: topic.name,
        imageUrl: rankedImages[i],
        value: i + 1, // Rank position (1-based)
      })
    }

    onComplete()
  }

  // If no images were clicked, show a message
  if (rankedImages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            No Images Selected
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            You didn't click any images during the click test, so we'll skip to the next topic.
          </p>
          <button
            onClick={onComplete}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Topic: {topic.name}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Drag and drop to rank these images by your preference
          </p>
          <p className="text-sm md:text-md text-gray-500 dark:text-gray-500 mt-2">
            (Your favorite should be at the top)
          </p>
        </div>

        {/* Sortable list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rankedImages}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {rankedImages.map((imageUrl, index) => (
                <SortableImage
                  key={imageUrl}
                  id={imageUrl}
                  imageUrl={imageUrl}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Next button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-lg text-lg md:text-xl transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

