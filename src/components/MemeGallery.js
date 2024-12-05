import React, { useState, useEffect } from 'react';

export function MemeGallery() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('/api/getMemes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure data is an array
        setMemes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching memes:', error);
        setError(error.message);
        setMemes([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
        <div className="animate-bounce">
          <p className="text-2xl title-text">Loading memes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
        <p className="text-xl text-red-600">Failed to load memes. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200">
      <header className="py-8 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
        <div className="container mx-auto px-4">
          <h1 className="title-text text-6xl text-center transform hover:scale-105 transition-transform duration-300">
            Yeet MEME Vault
          </h1>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto py-12 px-4">
        {memes.length === 0 ? (
          <p className="text-center text-2xl title-text">No memes found in the vault...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme, index) => (
              <div key={index} className="relative group aspect-square">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={meme.url || `/memes/${meme.filename}`}
                    alt="meme"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Error loading image: ${meme.filename}`);
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </div>
                <a
                  href={meme.url || `/memes/${meme.filename}`}
                  className="absolute bottom-2 right-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  download
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}