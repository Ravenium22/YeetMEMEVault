'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImagePreview } from '../components/ImagePreview';
import { GalleryControls, MobileGalleryControls } from '../components/GalleryControls';
import { useTheme } from 'next-themes';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadCounts, setDownloadCounts] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('newest');
  const { theme } = useTheme();

  useEffect(() => {
    fetchMemes();
    fetchDownloadCounts();
  }, []);

  // Sort memes whenever sort order changes
  useEffect(() => {
    if (memes.length > 0) {
      const sortedMemes = [...memes].sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        } else if (sortOrder === 'oldest') {
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        } else if (sortOrder === 'popular') {
          return (downloadCounts[b.public_id] || 0) - (downloadCounts[a.public_id] || 0);
        }
        return 0;
      });
      setMemes(sortedMemes);
    }
  }, [sortOrder, downloadCounts]);

  const fetchDownloadCounts = async () => {
    try {
      const response = await fetch('/api/getDownloadCounts');
      const data = await response.json();
      setDownloadCounts(data);
    } catch (error) {
      console.error('Error fetching download counts:', error);
    }
  };

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/getMemes');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching memes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (meme) => {
    try {
      // Track download
      const trackResponse = await fetch('/api/trackDownload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memeId: meme.public_id })
      });
      
      if (trackResponse.ok) {
        const { count } = await trackResponse.json();
        setDownloadCounts(prev => ({ ...prev, [meme.public_id]: count }));
      }

      // Start direct download
      const response = await fetch(meme.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = meme.filename || 'meme.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const showRandomMeme = () => {
    if (memes.length > 0) {
      const randomIndex = Math.floor(Math.random() * memes.length);
      setSelectedImage(memes[randomIndex]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 to-amber-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
      <Header isAdmin={false} />
      
      <main className="flex-grow max-w-6xl mx-auto py-12 px-4 w-full">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          {/* Desktop Controls */}
          <div className="hidden md:block">
            <GalleryControls 
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
          
          {/* Mobile Controls */}
          <MobileGalleryControls 
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <button
            onClick={showRandomMeme}
            className="w-full md:w-auto px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            Random Meme
          </button>
        </div>
        
        {loading ? (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
            "space-y-4"
          }>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-xl text-red-600 dark:text-red-400 text-center">{error}</p>
        ) : memes.length === 0 ? (
          <p className="text-center text-2xl title-text dark:text-white">No memes found in the vault...</p>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {memes.map((meme, index) => (
              <div 
                key={index} 
                className={`relative group ${
                  viewMode === 'grid' 
                    ? 'aspect-square' 
                    : 'flex items-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-4'
                }`}
              >
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'w-full h-full flex items-center justify-center p-4'
                    : 'flex-shrink-0 w-48 h-48 mr-4'
                  }
                `}>
                  <img 
                    src={meme.url}
                    alt="meme"
                    className={`
                      max-w-full max-h-full object-contain rounded-lg shadow-lg 
                      transition-all duration-300 cursor-pointer
                      ${viewMode === 'grid' ? 'group-hover:scale-105' : ''}
                      dark:shadow-gray-900
                    `}
                    onClick={() => setSelectedImage(meme)}
                    loading="lazy"
                  />
                </div>
                {viewMode === 'list' && (
                  <div className="flex-grow flex justify-between items-center">
                    <div className="text-sm dark:text-white">
                      Downloads: {downloadCounts[meme.public_id] || 0}
                    </div>
                    <button
                      onClick={() => handleDownload(meme)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all dark:bg-amber-600 dark:hover:bg-amber-700"
                    >
                      Download
                    </button>
                  </div>
                )}
                {viewMode === 'grid' && (
                  <button
                    onClick={() => handleDownload(meme)}
                    className="absolute bottom-2 right-2 px-4 py-2 bg-amber-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-amber-600 transition-all dark:bg-amber-600 dark:hover:bg-amber-700"
                  >
                    Download ({downloadCounts[meme.public_id] || 0})
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {selectedImage && (
        <ImagePreview 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          downloadCount={downloadCounts[selectedImage.public_id] || 0}
        />
      )}
    </div>
  );
}