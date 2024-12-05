import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOrder, setSortOrder] = useState('newest');
  const [downloadCounts, setDownloadCounts] = useState({});
  const [memeOfTheDay, setMemeOfTheDay] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalDownloads: 0,
    totalUploads: 0,
    popularMemes: [],
  });

  // Dark mode handler
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Track downloads
  const incrementDownload = async (memeId) => {
    try {
      const response = await fetch('/api/trackDownload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memeId }),
      });
      const data = await response.json();
      setDownloadCounts(prev => ({
        ...prev,
        [memeId]: (prev[memeId] || 0) + 1
      }));
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      viewMode,
      setViewMode,
      sortOrder,
      setSortOrder,
      downloadCounts,
      incrementDownload,
      memeOfTheDay,
      analytics
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);