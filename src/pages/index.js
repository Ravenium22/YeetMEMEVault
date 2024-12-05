'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { GalleryControls } from '../components/GalleryControls';
import { ImagePreview } from '../components/ImagePreview';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadCounts, setDownloadCounts] = useState({});
  
  const { 
    darkMode, 
    viewMode, 
    sortOrder
  } = useAppContext();

  useEffect(() => {
    fetchMemes();
  }, [sortOrder]);

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/getMemes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      
      // Sort memes based on sortOrder
      if (sortOrder === 'newest') {
        data = data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      } else if (sortOrder === 'oldest') {
        data = data.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
      } else if (sortOrder === 'popular') {
        data = data.sort((a, b) => (downloadCounts[b.filename] || 0) - (downloadCounts[a.filename] || 0));
      }

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
      // Update download count
      setDownloadCounts(prev => ({
        ...prev,
        [meme.filename]: (prev[meme.filename] || 0) + 1
      }));

      // Create a hidden anchor element
      const link = document.createElement('a');
      link.href = meme.url || `/memes/${meme.filename}`;
      link.download = meme.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track download in localStorage
      const downloads = JSON.parse(localStorage.getItem('downloads') || '{}');
      downloads[meme.filename] = (downloads[meme.filename] || 0) + 1;
      localStorage.setItem('downloads', JSON.stringify(downloads));
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

  // Load download counts from localStorage on initial load
  useEffect(() => {
    const savedDownloads = JSON.parse(localStorage.getItem('downloads') || '{}');
    setDownloadCounts(savedDownloads);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200 dark:from-gray-800 dark:to-gray-900">
        <Header isAdmin={false} />
        
        <main className="max-w-6xl mx-auto py-12 px-4">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <GalleryControls />
            <button
              onClick={showRandomMeme}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
            >
              Random Meme
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-xl text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          ) : memes.length === 0 ? (
            <p className="text-center text-2xl title-text dark:text-white">
              No memes found in the vault...
            </p>
          ) : (
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
              "space-y-4"
            }>
              {memes.map((meme, index) => (
                <div 
                  key={index} 
                  className={`relative group ${
                    viewMode === 'grid' ? 'aspect-square' : 'flex items-center gap-4'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={meme.url || `/memes/${meme.filename}`}
                      alt="meme"
                      className={`
                        max-w-full max-h-full object-contain rounded-lg shadow-lg 
                        transition-all duration-300 group-hover:scale-105 cursor-pointer
                        ${viewMode === 'list' ? 'max-w-[200px]' : ''}
                      `}
                      onClick={() => setSelectedImage(meme)}
                      loading="lazy"
                    />
                  </div>
                  <div className={`
                    absolute bottom-2 right-2 flex gap-2 
                    opacity-0 group-hover:opacity-100 transition-opacity
                  `}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(meme);
                      }}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                    >
                      Download ({downloadCounts[meme.filename] || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Image Preview Modal */}
        {selectedImage && (
          <ImagePreview 
            image={selectedImage} 
            onClose={() => setSelectedImage(null)}
            onDownload={handleDownload}
            downloadCount={downloadCounts[selectedImage.filename] || 0}
          />
        )}
      </div>
    </div>
  );
}