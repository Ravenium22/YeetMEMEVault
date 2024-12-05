import React, { useState, useEffect } from 'react';

export function MemeGallery() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('/api/getMemes');
        const data = await response.json();
        setMemes(data);
      } catch (error) {
        console.error('Error fetching memes:', error);
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
          <div className="meme-grid">
            {memes.map((meme, index) => (
              <div key={index} className="meme-container group">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={meme.url || `/memes/${meme.filename}`}
                    alt="meme"
                    className="meme-image rounded-lg shadow-lg group-hover:scale-105 group-hover:brightness-110"
                    onError={(e) => {
                      console.error(`Error loading image: ${meme.filename}`);
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </div>
                <a
                  href={`/memes/${meme.filename}`}
                  className="download-button group-hover:opacity-100 group-hover:translate-y-0 hover:bg-amber-600 hover:scale-105"
                  download
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center">
        <p className="text-amber-800 font-righteous">© {new Date().getFullYear()} Yeet MEME Vault</p>
      </footer>
    </div>
  );
}