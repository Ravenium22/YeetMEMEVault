import React from 'react';
import { useAppContext } from '../context/AppContext';

export function GalleryControls() {
  const { 
    darkMode, 
    toggleDarkMode, 
    viewMode, 
    setViewMode, 
    sortOrder, 
    setSortOrder 
  } = useAppContext();

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-4">
        {/* View Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 ${
              viewMode === 'grid' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white dark:bg-gray-800 dark:text-white'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 ${
              viewMode === 'list' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white dark:bg-gray-800 dark:text-white'
            }`}
          >
            List
          </button>
        </div>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Downloaded</option>
        </select>
      </div>

      <div className="flex gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-gray-800"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>

        {/* Random Meme Button */}
        <button
          onClick={() => {/* Add random meme logic */}}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Random Meme
        </button>
      </div>
    </div>
  );
}