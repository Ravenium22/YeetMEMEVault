import React from 'react';

export function MemeCard({ meme, onView, onDownload }) {
  return (
    <div className="meme-card group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={meme.url}
          alt={meme.filename || "Meme"}
          className="meme-image"
          onClick={() => onView(meme)}
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-honey-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-medium truncate max-w-[200px]">
              {meme.filename}
            </p>
          </div>
        </div>
        
        {/* Download Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(meme);
          }}
          className="download-button btn-honey-primary text-sm"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export function HallCard({ photo, onView }) {
  return (
    <div className="meme-card group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={photo.url}
          alt={photo.filename || "Tattoo photo"}
          className="meme-image"
          onClick={() => onView(photo)}
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-honey-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-medium truncate max-w-[200px]">
              {photo.filename}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
