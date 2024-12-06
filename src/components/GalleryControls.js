import React from 'react';
import { useTheme } from 'next-themes';

export function GalleryControls({ viewMode, setViewMode, sortOrder, setSortOrder }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* View Mode Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'grid' 
              ? 'bg-amber-500 text-white' 
              : 'bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700'
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode('compact')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'compact' 
              ? 'bg-amber-500 text-white' 
              : 'bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700'
          }`}
        >
          Compact
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'list' 
              ? 'bg-amber-500 text-white' 
              : 'bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700'
          }`}
        >
          List
        </button>
      </div>

      {/* Sort Controls */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white border-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="popular">Most Downloaded</option>
      </select>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
    </div>
  );
}

export function MobileGalleryControls({ viewMode, setViewMode, sortOrder, setSortOrder }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4 w-full md:hidden">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'grid' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'compact' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white'
            }`}
          >
            Compact
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'list' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white'
            }`}
          >
            List
          </button>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1 rounded-lg bg-white/80 dark:bg-gray-800"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="w-full px-3 py-1 rounded-lg bg-white/80 dark:bg-gray-800 text-amber-900 dark:text-white text-sm"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="popular">Most Downloaded</option>
      </select>
    </div>
  );
}