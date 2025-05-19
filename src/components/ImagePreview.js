import React, { useState } from 'react';

export function ImagePreview({ image, onClose, onDownload, hideDownloadButton = false }) {
  const [isZoomed, setIsZoomed] = useState(false);
  
  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-white dark:bg-honey-900 rounded-lg overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-honey-200 dark:border-honey-700 bg-honey-50 dark:bg-honey-800">
          <h3 className="text-lg font-bold text-honey-800 dark:text-honey-200">
            {image.filename || 'Image Preview'}
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleZoom}
              className="text-honey-500 hover:text-honey-700 dark:hover:text-honey-300 transition-colors"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              title={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isZoomed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                )}
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="text-honey-500 hover:text-honey-700 dark:hover:text-honey-300 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Image Container */}
        <div 
          className={`p-4 flex items-center justify-center bg-honey-100/50 dark:bg-honey-800/50 backdrop-blur-sm ${isZoomed ? 'overflow-auto max-h-[70vh] cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
        >
          <img 
            src={image.url}
            alt={image.filename || "Preview image"}
            className={`object-contain rounded-lg shadow-lg transition-all duration-300 ${
              isZoomed 
                ? 'max-w-none max-h-none transform scale-150' 
                : 'max-h-[70vh] max-w-full'
            }`}
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-honey-200 dark:border-honey-700 flex justify-between items-center bg-honey-50 dark:bg-honey-800">
          {!hideDownloadButton && (
            <>
              <div className="text-sm text-honey-700 dark:text-honey-300">
                Click image to zoom
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
                className="btn-honey-primary text-sm"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </div>
              </button>
            </>
          )}
          {hideDownloadButton && (
            <div className="text-sm text-honey-700 dark:text-honey-300 w-full text-center">
              Part of the Hall of Yeetardation collection • Click image to zoom
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
