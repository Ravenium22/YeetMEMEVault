'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { MemeCard } from '../components/MemeCard';
import { ImagePreview } from '../components/ImagePreview';
import { useTheme } from 'next-themes';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  // Load memes
  useEffect(() => {
    fetchMemes();
  }, []);

  // Sort memes whenever order changes
  useEffect(() => {
    if (memes.length > 0) {
      const sortedMemes = [...memes].sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        } else if (sortOrder === 'oldest') {
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        }
        return 0;
      });
      setMemes(sortedMemes);
    }
  }, [sortOrder]);

  const fetchMemes = async () => {
    try {
      setLoading(true);
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

  const handleDownload = async (media) => {
    try {
      // Fetch and download the media
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      
      // Set appropriate extension based on file type
      const isVideo = media.fileType === 'video';
      const extension = isVideo ? 
        (media.url.includes('.mp4') ? '.mp4' : '.mp4') : // Default to mp4
        (media.url.includes('.gif') ? '.gif' : '.jpg');
        
      link.download = (media.filename || 'media') + (media.filename?.includes(extension) ? '' : extension);
      
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

  // Filter memes based on search term
  const filteredMemes = memes.filter(meme => 
    meme.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count videos for display
  const videoCount = memes.filter(meme => meme.fileType === 'video').length;
  const imageCount = memes.length - videoCount;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <div className="bg-white/80 dark:bg-honey-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-honey-900 dark:text-honey-100 font-medium">
              📚 Vault Collection: {memes.length} items
            </span>
          </div>
          <div className="bg-white/80 dark:bg-honey-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-honey-900 dark:text-honey-100 font-medium">
              🖼️ Images: {imageCount}
            </span>
          </div>
          <div className="bg-white/80 dark:bg-honey-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-honey-900 dark:text-honey-100 font-medium">
              🎬 Videos: {videoCount}
            </span>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memes..."
              className="honey-input w-full pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-honey-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          {/* View Controls */}
          <div className="flex gap-2">
            <div className="flex bg-white dark:bg-honey-800 rounded-lg shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-l-lg ${
                  viewMode === 'grid' 
                    ? 'bg-honey-500 text-white' 
                    : 'text-honey-800 dark:text-honey-200 hover:bg-honey-100 dark:hover:bg-honey-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-r-lg ${
                  viewMode === 'list' 
                    ? 'bg-honey-500 text-white' 
                    : 'text-honey-800 dark:text-honey-200 hover:bg-honey-100 dark:hover:bg-honey-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="honey-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            {/* Random Button */}
            <button
              onClick={showRandomMeme}
              className="btn-honey-primary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Random
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="honey-card animate-pulse">
                <div className="aspect-square bg-honey-200 dark:bg-honey-700"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-honey-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-honey-800 dark:text-honey-200 mb-2">Oops! Something went wrong</h2>
            <p className="text-honey-700 dark:text-honey-300">{error}</p>
            <button onClick={fetchMemes} className="mt-4 btn-honey-primary">
              Try Again
            </button>
          </div>
        ) : filteredMemes.length === 0 ? (
          <div className="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-honey-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-honey-800 dark:text-honey-200 mb-2">No memes found</h2>
            <p className="text-honey-700 dark:text-honey-300">
              {searchTerm ? `No memes match your search "${searchTerm}"` : "Your meme vault is empty. Upload some memes!"}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="mt-4 btn-honey-primary">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'meme-grid' : 'space-y-4'}>
            {filteredMemes.map((meme, index) => (
              <MemeCard
                key={index}
                meme={meme}
                onView={setSelectedImage}
                onDownload={handleDownload}
              />
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
          hideDownloadButton={false}
        />
      )}
    </div>
  );
}
