'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ImagePreview } from '../components/ImagePreview';
import { GalleryControls } from '../components/GalleryControls';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadCounts, setDownloadCounts] = useState({});

  useEffect(() => {
    fetchMemes();
    fetchDownloadCounts();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200">
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
                <div className="bg-gray-200 h-48 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-xl text-red-600 text-center">{error}</p>
        ) : memes.length === 0 ? (
          <p className="text-center text-2xl title-text">No memes found in the vault...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme, index) => (
              <div key={index} className="relative group aspect-square">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={meme.url}
                    alt="meme"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedImage(meme)}
                    loading="lazy"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(meme);
                  }}
                  className="absolute bottom-2 right-2 px-4 py-2 bg-amber-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-amber-600 transition-all"
                >
                  Download ({downloadCounts[meme.public_id] || 0})
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

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